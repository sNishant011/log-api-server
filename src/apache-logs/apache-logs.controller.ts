import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/decorator/role.decorator';
import { AccessAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { ApacheLogsService } from './apache-logs.service';
import { ApacheLog } from './entities/apache-log.entity';

@ApiTags('apache-logs')
@Controller('apache-logs')
export class ApacheLogsController {
  constructor(private readonly apacheLogsService: ApacheLogsService) {}

  @Role([UserRole.ADMIN, , UserRole.APACHE])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Get all apache logs',
    type: [ApacheLog],
  })
  @Get()
  findAll() {
    return this.apacheLogsService.findAll();
  }

  @Role([UserRole.ADMIN, , UserRole.APACHE])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Get('pretty')
  getDataForVisualization() {
    return this.apacheLogsService.getDataForVisualization();
  }

  @Role([UserRole.ADMIN, , UserRole.APACHE])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Get('ip-addresses')
  getIPAddresses() {
    return this.apacheLogsService.getIPAddresses();
  }
}
