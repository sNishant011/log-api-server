import { Test, TestingModule } from '@nestjs/testing';
import { ApacheLogsService } from './apache-logs.service';

describe('ApacheLogsService', () => {
  let service: ApacheLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApacheLogsService],
    }).compile();

    service = module.get<ApacheLogsService>(ApacheLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
