import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary.service';
import { BadRequestException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            relatedPost: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRelatedPosts', () => {
    it('should return a list of related posts without limit', async () => {
      const posts = [
        {
          id: 1,
          title: 'Test Post',
          imageUrl: 'http://test.com/image.jpg',
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.relatedPost, 'findMany')
        .mockResolvedValue(posts as any);

      const result = await service.getRelatedPosts();

      expect(prismaService.relatedPost.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(posts);
    });

    it('should return a list of related posts with limit', async () => {
      const posts = [
        {
          id: 1,
          title: 'Test Post',
          imageUrl: 'http://test.com/image.jpg',
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.relatedPost, 'findMany')
        .mockResolvedValue(posts as any);

      const result = await service.getRelatedPosts(5);

      expect(prismaService.relatedPost.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      expect(result).toEqual(posts);
    });
  });

  describe('createRelatedPost', () => {
    it('should throw BadRequestException if file is not provided', async () => {
      await expect(
        service.createRelatedPost('Test Title', undefined as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upload image and create related post', async () => {
      const file = { originalname: 'test.jpg' } as Express.Multer.File;
      const imageUrl = 'http://test.com/test.jpg';
      const createdPost = {
        id: 1,
        title: 'Test Title',
        imageUrl,
        createdAt: new Date(),
      };

      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue(imageUrl);
      jest
        .spyOn(prismaService.relatedPost, 'create')
        .mockResolvedValue(createdPost as any);

      const result = await service.createRelatedPost('Test Title', file);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(file);
      expect(prismaService.relatedPost.create).toHaveBeenCalledWith({
        data: { title: 'Test Title', imageUrl },
      });
      expect(result).toEqual(createdPost);
    });
  });
});
