import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  registrationId: string;

  @IsBoolean()
  @IsOptional()
  passFeesToBuyer?: boolean;
}

export class VerifyPaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  paymentId: string;

  @IsString()
  signature: string;
}

export class InitiateRefundDto {
  @IsString()
  registrationId: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}

export class ManualVerifyPaymentDto {
  @IsString()
  orderId: string;
}
