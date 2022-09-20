import { BadRequestException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { S3 } from 'aws-sdk';
import { Utils } from '../Middleware/Utils';

@Injectable()
export class ImageUploadService {
  async uploadImage(req, fileDetails) {
    try {
      if (
        !req.body.size.includes([2048, 1024, 800]) ||
        fileDetails.size >= 1000000
      ) {
        throw new BadRequestException(
          'We support only this sized: 2048 1024, 800 and size less then 1000000',
        );
      }
      const size = req.body.size ? req.body.size : 800;
      const originalName = fileDetails.originalname;
      const checkImageFormat = await Utils.checkImageFormat(fileDetails);
      if (checkImageFormat != true) {
        throw new BadRequestException('We dont support this type of file');
      }
      const sharpedImage = await sharp(fileDetails.buffer)
        .resize({
          fit: sharp.fit.contain,
          width: size,
          height: size,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
      await this.uploadS3(sharpedImage, 'bucket', originalName);
      return 'Success';
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          throw new BadRequestException(err);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
