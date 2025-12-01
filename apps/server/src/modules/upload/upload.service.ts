import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;
  private bucketName: string;
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );
    this.bucketName =
      this.configService.get<string>('SUPABASE_BUCKET') || 'uploads';

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException(
        'Supabase credentials not configured',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Express.Multer.File) {
    return this.uploadToSupabase(file);
  }

  private async uploadToSupabase(file: Express.Multer.File) {
    // 1. Validate MIME Type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // 2. Validate File Extension (Security Check)
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      throw new BadRequestException('Invalid file extension.');
    }

    try {
      // 2. Generate Unique Filename
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // 3. Upload to Supabase
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // 4. Get Public URL
      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return {
        url: publicUrlData.publicUrl,
        key: fileName,
        originalName: file.originalname,
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }
}
