/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() item: CreateItemDto,
  ) {
    return this.itemService.uploadImage(file, item);
  }

  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() item: CreateItemDto,
  ) {
    return this.itemService.uploadVideo(file, item);
  }
  @Get()
  getAll() {
    return this.itemService.getAll();
  }
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.itemService.findById(id);
  }

}
