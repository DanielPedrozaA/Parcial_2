import { Test, TestingModule } from '@nestjs/testing';
import { BonoController } from './bono.controller';

describe('BonoController', () => {
  let controller: BonoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonoController],
    }).compile();

    controller = module.get<BonoController>(BonoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
