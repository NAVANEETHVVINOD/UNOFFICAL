import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class QrService {
    async generateQrCode(eventId: string): Promise<{ qrCodeDataUrl: string; token: string }> {
        // Generate a secure token for the event
        const token = crypto.randomBytes(32).toString('hex');
        const payload = JSON.stringify({ eventId, token });

        // Generate QR code data URL
        const qrCodeDataUrl = await QRCode.toDataURL(payload);

        return { qrCodeDataUrl, token };
    }

    validateToken(token: string, storedToken: string): boolean {
        return token === storedToken;
    }
}
