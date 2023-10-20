import { Controller, Get, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async getMetrics() {
    const metrics = await this.prisma.$metrics.prometheus();
    console.log('----------------------------');
    console.log(metrics);
    return metrics;
  }
}
