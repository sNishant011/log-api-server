import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Get all apache logs',
    type: [ApacheLog],
  })
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
    const data = await this.apacheLogsService.findAll(
      +current,
      +pageSize,
      ipAddress,
      date,
    );
    const totalCount = await this.apacheLogsService.getTotalCount(
      ipAddress,
      date,
    );
    return {
      data,
      total: totalCount,
    };
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
