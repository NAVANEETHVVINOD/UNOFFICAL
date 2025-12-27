import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { CorsConfig } from './cors.config';
import { configValidationSchema } from './validation.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [AppConfigService, CorsConfig],
  exports: [AppConfigService, CorsConfig],
})
export class AppConfigModule {}
