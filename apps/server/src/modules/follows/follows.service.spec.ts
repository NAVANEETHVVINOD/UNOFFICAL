import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('FollowsService', () => {
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            follows: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            createNotification: jest.fn(),
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
