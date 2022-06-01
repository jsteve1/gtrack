import { Test, TestingModule } from '@nestjs/testing';
import { Goals } from './goals';

describe('Goals', () => {
  let provider: Goals;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Goals],
    }).compile();

    provider = module.get<Goals>(Goals);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
