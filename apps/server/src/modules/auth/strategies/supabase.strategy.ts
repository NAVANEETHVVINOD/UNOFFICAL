
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('SUPABASE_JWT_SECRET');
        if (!secret) throw new Error('SUPABASE_JWT_SECRET is not defined');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            algorithms: ['HS256'],
        });
    }

    async validate(payload: any) {
        if (!payload.sub) throw new UnauthorizedException('Invalid token: missing sub');
        return payload; // { sub, email, ... }
    }
}
