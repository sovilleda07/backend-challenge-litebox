import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, CloudinaryService],
})
export class PostsModule {}
