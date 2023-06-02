import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @ApiQuery({
    type: String,
    name: 'ipAddress',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'date',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Get all nginx logs',
    type: [NginxLog],
  })
  @ApiQuery({
    type: Number,
    name: 'current',
    required: true,
  })
  @ApiQuery({
    type: Number,
    name: 'pageSize',
    required: true,
  })
  @Role([UserRole.ADMIN, , UserRole.NGINX])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @Get()
  async findAll(
    @Query('ipAddress') ipAddress?: string,
    @Query('date') date?: string,
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    if (!current && !pageSize) {
      throw new HttpException(
        {
          message: 'Pagination query are required',
        },
        400,
      );
    }

    const data = await this.nginxLogsService.findAll(
      +current,
      +pageSize,
      ipAddress,
      date,
    );
    const totalCount = await this.nginxLogsService.getTotalCount(
      ipAddress,
      date,
    );
    return {
      data,
      total: totalCount,
    };
  }

  @Role([UserRole.ADMIN, , UserRole.NGINX])
  @UseGuards(AccessAuthGuard, RoleGuard)
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
