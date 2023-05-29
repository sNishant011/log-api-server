import { Test, TestingModule } from '@nestjs/testing';
import { NginxLogsController } from './nginx-logs.controller';
import { NginxLogsService } from './nginx-logs.service';

describe('NginxLogsController', () => {
  let controller: NginxLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NginxLogsController],
      providers: [NginxLogsService],
    }).compile();

    controller = module.get<NginxLogsController>(NginxLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
