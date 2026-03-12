import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('api')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/related')
  async getRelatedPosts() {
    return this.postsService.getRelatedPosts();
  }

  @Post('post/related')
  async createRelatedPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createRelatedPost(createPostDto);
  }
}
