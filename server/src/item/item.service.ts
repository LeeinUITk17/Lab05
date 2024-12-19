/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateItemDto } from './dto/create-item.dto';
@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async uploadImage(file: Express.Multer.File, Item: CreateItemDto) {
    try {
      const uploadResponse = await this.cloudinaryService.uploadFile(file);
      const savedImage = await this.prismaService.item.create({
        data: {
          title: Item.title,
          Upload: uploadResponse.secure_url,
        },
      });

      return savedImage;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadVideo(file: Express.Multer.File, Item: CreateItemDto) {
    try {
      const uploadResponse = await this.cloudinaryService.uploadVideo(file);
      const savedVideo = await this.prismaService.item.create({
        data: {
          title: Item.title,
          Upload: uploadResponse.secure_url,
        },
      });

      return savedVideo;
    } catch (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }
  async getAll() {
    return this.prismaService.item.findMany();
  }
  async findById(id: number) {
    return this.prismaService.item.findUnique({ where: { id } });
  }
}
