import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/decorator/role.decorator';
import { AccessAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { NginxLog } from './entities/nginx-log.entity';
import { NginxLogsService } from './nginx-logs.service';

@ApiTags('nginx-logs')
@Controller('nginx-logs')
export class NginxLogsController {
  constructor(private readonly nginxLogsService: NginxLogsService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all nginx logs',
    type: [NginxLog],
  })
  @Role([UserRole.ADMIN, , UserRole.NGINX])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.nginxLogsService.findAll();
  }

  @Get('pretty')
  getDataForVisualization() {
    return this.nginxLogsService.getDataForVisualization();
  }

  @ApiResponse({
    status: 200,
    description: 'Get all nginx logs',
    type: NginxLog,
  })
  @Role([UserRole.ADMIN, , UserRole.NGINX])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nginxLogsService.findOne(id);
  }

  @Role([UserRole.ADMIN, , UserRole.NGINX])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nginxLogsService.remove(id);
  }
}
