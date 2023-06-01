import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApacheLogsService } from './apache-logs.service';
import { ApacheLog } from './entities/apache-log.entity';

@ApiTags('apache-logs')
@Controller('apache-logs')
export class ApacheLogsController {
  constructor(private readonly apacheLogsService: ApacheLogsService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all apache logs',
    type: [ApacheLog],
  })
  @Get()
  findAll() {
    return this.apacheLogsService.findAll();
  }

  @Get('pretty')
  getDataForVisualization() {
    return this.apacheLogsService.getDataForVisualization();
  }

  @Get('ip-addresses')
  getIPAddresses() {
    return this.apacheLogsService.getIPAddresses();
  }
}
