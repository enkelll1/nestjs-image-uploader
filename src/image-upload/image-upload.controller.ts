import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Request() req,
    @UploadedFile() fileDetails: Express.Multer.File,
  ): Promise<any> {
    return await this.imageUploadService.uploadImage(req, fileDetails);
  }
}
