import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  UploadedFile,
  // ParseFilePipe,
  // MaxFileSizeValidator,
  // FileTypeValidator,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
  // Param,
  Res,
  Body,
  Delete,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  // FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { Response } from 'express';
import * as path from 'path';
import { existsSync, unlinkSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // Single file
  // 1000 == 1 kOctet
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 300000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return { message: 'success' };
  }

  @Get('upload/')
  getFile(@Res() res: Response, @Body() name) {
    const file = path.join(__dirname, '../uploads/' + name.fileName);
    console.log(file);
    return res.sendFile(file);
  }

  @Delete('upload/')
  async deleteFile(@Res() res: Response, @Body() name) {
    try {
      const file = path.join(__dirname, '../uploads/' + name.fileName);
      if (existsSync(file)) {
        unlinkSync(file);
      } else {
        res.json({ message: 'Ce fichier n existe pas' });
      }
      res.json({ message: 'Your file was deleted' });
    } catch (err) {
      res.json({ message: 'An error has occured', error: err.message });
    }
  }
  // Muliple file
  @Post('multiple/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  uploadFiles(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }

  @Post('multiple/any/upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFilesAny(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
}
