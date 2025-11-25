import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private supabase: SupabaseClient;
    private bucketName = 'uploads'; // Ensure this bucket exists in Supabase

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('supabase.url');
        const supabaseKey = this.configService.get<string>('supabase.key');

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase URL and Key not found. Uploads will fail.');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async uploadFile(file: Express.Multer.File) {
        if (!this.supabase) {
            throw new InternalServerErrorException('Supabase not configured');
        }

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `${fileName}`;

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new InternalServerErrorException('Failed to upload file');
        }

        const { data: { publicUrl } } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);

        return {
            url: publicUrl,
            key: filePath,
            originalName: file.originalname,
        };
    }
}
