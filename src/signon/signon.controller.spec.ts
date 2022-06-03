import { Test, TestingModule } from '@nestjs/testing';
import { SignonController } from './signon.controller';

describe('SignonController', () => {
  let controller: SignonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignonController],
    }).compile();

    controller = module.get<SignonController>(SignonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
