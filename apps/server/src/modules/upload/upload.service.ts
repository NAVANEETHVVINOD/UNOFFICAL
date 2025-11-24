import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    async uploadFile(file: Express.Multer.File) {
        // TODO: Implement S3/Supabase upload
        return {
            url: `https://placeholder.com/${file.filename}`,
            key: file.filename,
        };
    }
}
