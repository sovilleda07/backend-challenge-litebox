import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getRelatedPosts() {
    return this.prisma.relatedPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRelatedPost(post: CreatePostDto) {
    return this.prisma.relatedPost.create({
      data: post
    });
  }
}
