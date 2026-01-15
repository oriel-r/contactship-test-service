import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    const rawUserAgent = req.get('user-agent') || '';

    const uaParser = new UAParser(rawUserAgent);
    const result = uaParser.getResult();
    const browser =
      `${result.browser.name ?? 'Unknown Browser'} ${result.browser.version ?? ''}`.trim();
    const os =
      `${result.os.name ?? 'Unknown OS'} ${result.os.version ?? ''}`.trim();

    const summarizedUserAgent = `${browser} - ${os}`;

    this.logger.log(
      `${method} ${originalUrl} - ${ip} - ${summarizedUserAgent}`,
    );

    next();
  }
}
