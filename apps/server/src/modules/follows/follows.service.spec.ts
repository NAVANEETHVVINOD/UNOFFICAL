import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FollowsService', () => {
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: PrismaService,
          useValue: {
            follow: {
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
