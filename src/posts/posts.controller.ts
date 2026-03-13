import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('api')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/related')
  @ApiOperation({ summary: 'Get related posts with optional limit' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of posts to return. No limit brings all.',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'List of related posts returned successfully.',
  })
  async getRelatedPosts(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postsService.getRelatedPosts(limit);
  }

  @Post('post/related')
  @ApiOperation({ summary: 'Create a related post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'image'],
      properties: {
        title: {
          type: 'string',
          example: 'My technology post',
          maxLength: 100,
        },
        image: {
          type: 'string',
          format: 'binary',
          description:
            'Image of the post (jpeg, jpg, png, gif, webp — max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or unauthorized image',
  })
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
