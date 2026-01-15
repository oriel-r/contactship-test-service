import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Observable, tap } from 'rxjs';
import appConfig from 'src/config/app.config';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly active: boolean = process.env.NODE_ENV === 'DEVELOPMENT'

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const label = `${method} ${url}`;
    
    const start = process.hrtime.bigint();
    const memBefore = this.heap();
    
    if (this.active) {
      this.logger.debug(
        `⇢ ${label} | Memory before: ${memBefore.toFixed(1)} MB`,
      );
    }
    
    return next.handle().pipe(
      tap(() => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1_000_000;
        const memAfter = this.heap();
        const memUsed = memAfter - memBefore;
        
        if (this.active) {
          global.gc?.();
          this.logger.debug(
            `⇠ ${label} | ${duration.toFixed(2)}ms | +${memUsed.toFixed(1)} MB (after: ${memAfter.toFixed(1)} MB)`,
          );
        } else {
          this.logger.log(`${method} ${url} - ${duration.toFixed(2)}ms`);
        }
      }),
    );
  }

  private heap(): number {
    return process.memoryUsage().heapUsed / 1024 / 1024;
  }

}
