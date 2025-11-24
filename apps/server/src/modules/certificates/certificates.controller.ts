import { Controller, Post, Param, Res, UseGuards, Request } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('generate/:eventId')
    async generate(@Request() req, @Param('eventId') eventId: string, @Res() res: Response) {
        const buffer = await this.certificatesService.generateCertificate(req.user.userId, eventId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=certificate-${eventId}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
