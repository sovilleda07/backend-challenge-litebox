import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getRelatedPosts(limit?: number) {
    return this.prisma.relatedPost.findMany({
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });
  }

  async createRelatedPost(title: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required!');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);

    return this.prisma.relatedPost.create({
      data: { title, imageUrl },
    });
  }
}
