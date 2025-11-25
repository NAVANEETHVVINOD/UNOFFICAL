import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

describe('MarketplaceController', () => {
  let controller: MarketplaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketplaceController],
      providers: [
        {
          provide: MarketplaceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MarketplaceController>(MarketplaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
