import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
    constructor(private prisma: PrismaService) { }

    async generateCertificate(userId: string, eventId: string) {
        // 1. Fetch user and event details
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });

        if (!user || !event) {
            throw new Error('User or Event not found');
        }

        // 2. Create PDF
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        // Design
        doc.fontSize(40).text('Certificate of Participation', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(30).text(user.profile?.fullName || user.email, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`has participated in`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(30).text(event.title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(15).text(`Date: ${event.startsAt.toDateString()}`, { align: 'center' });

        doc.end();

        // 3. Return buffer (In real app, upload to S3 and return URL)
        return new Promise<Buffer>((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
}
