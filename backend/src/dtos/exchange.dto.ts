import { IsString, IsNumber, Min } from 'class-validator';

export class ConvertDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  fromCurrency: string;

  @IsString()
  toCurrency: string;
}
