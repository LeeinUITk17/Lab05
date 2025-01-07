/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  Upload: string;
  @IsNotEmpty()
  @IsString()
  latitude: number;

  @IsNotEmpty()
  @IsString()
  longitude: number;
}
