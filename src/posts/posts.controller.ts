import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@Controller('api')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/related')
  async getRelatedPosts() {
    return this.postsService.getRelatedPosts();
  }

  @Post('post/related')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const isValid = allowedTypes.test(
          extname(file.originalname).toLowerCase(),
        );

        if (isValid) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createRelatedPost(
    @Body() post: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.createRelatedPost(post.title, file);
  }
}
