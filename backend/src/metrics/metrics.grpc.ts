import { Controller } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, from } from 'rxjs';
import { bufferCount, concatMap, map, reduce } from 'rxjs/operators';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';

@Controller()
export class MetricsGrpcController {
  constructor(private readonly metricsService: MetricsService) {}

  @GrpcStreamMethod('metrics.MetricsIngestService', 'StreamMetrics')
  streamMetrics(stream$: Observable<CreateMetricDto>) {
    const BATCH_SIZE = 100;
    return stream$.pipe(
      bufferCount(BATCH_SIZE),
      concatMap((chunk) => {
        return from(this.metricsService.create(chunk)).pipe(
          map(() => chunk.length),
        );
      }),
      reduce((acc, n) => acc + n, 0),
      map((total) => ({ success: true, receivedCount: total })),
    );
  }
}
