/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Module({
  imports: [PrismaModule],
  controllers: [ItemController],
  providers: [ItemService, CloudinaryService],
})
export class ItemModule {}
