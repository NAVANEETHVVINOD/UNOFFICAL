import { Test, TestingModule } from '@nestjs/testing';
import { CollegesService } from './colleges.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CollegesService', () => {
  let service: CollegesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollegesService,
        {
          provide: PrismaService,
          useValue: {
            college: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CollegesService>(CollegesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
