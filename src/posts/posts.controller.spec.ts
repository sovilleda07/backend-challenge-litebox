import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            getRelatedPosts: jest.fn(),
            createRelatedPost: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRelatedPosts', () => {
    it('should call postsService.getRelatedPosts without limit', async () => {
      const posts = [
        {
          id: 1,
          title: 'Test Post',
          imageUrl: 'http://test.com/image.jpg',
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(postsService, 'getRelatedPosts')
        .mockResolvedValue(posts as any);

      const result = await controller.getRelatedPosts();

      expect(postsService.getRelatedPosts).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(posts);
    });

    it('should call postsService.getRelatedPosts with limit', async () => {
      const posts = [
        {
          id: 1,
          title: 'Test Post',
          imageUrl: 'http://test.com/image.jpg',
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(postsService, 'getRelatedPosts')
        .mockResolvedValue(posts as any);

      const result = await controller.getRelatedPosts(3);

      expect(postsService.getRelatedPosts).toHaveBeenCalledWith(3);
      expect(result).toEqual(posts);
    });
  });

  describe('createRelatedPost', () => {
    it('should call postsService.createRelatedPost', async () => {
      const dto: CreatePostDto = { title: 'New Post', image: '' };
      const file = { originalname: 'test.jpg' } as Express.Multer.File;
      const createdPost = {
        id: 1,
        title: 'New Post',
        imageUrl: 'http://test.com/test.jpg',
        createdAt: new Date(),
      };

      jest
        .spyOn(postsService, 'createRelatedPost')
        .mockResolvedValue(createdPost as any);

      const result = await controller.createRelatedPost(dto, file);

      expect(postsService.createRelatedPost).toHaveBeenCalledWith(
        dto.title,
        file,
      );
      expect(result).toEqual(createdPost);
    });
  });
});
