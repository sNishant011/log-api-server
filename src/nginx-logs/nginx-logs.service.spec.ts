import { Test, TestingModule } from '@nestjs/testing';
import { NginxLogsService } from './nginx-logs.service';

describe('NginxLogsService', () => {
  let service: NginxLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NginxLogsService],
    }).compile();

    service = module.get<NginxLogsService>(NginxLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
