import { Test, TestingModule } from '@nestjs/testing';
import { ApacheLogsController } from './apache-logs.controller';
import { ApacheLogsService } from './apache-logs.service';

describe('ApacheLogsController', () => {
  let controller: ApacheLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApacheLogsController],
      providers: [ApacheLogsService],
    }).compile();

    controller = module.get<ApacheLogsController>(ApacheLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
