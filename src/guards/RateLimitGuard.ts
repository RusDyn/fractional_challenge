import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DbService } from '../db/db.service';

export const SetApiWeight = (weight: number) =>
  SetMetadata('apiWeight', weight);

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly apiService: DbService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const weight = this.reflector.get<number>(
      'apiWeight',
      context.getHandler(),
    );
    if (!weight) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiId = await this.apiService.getId(request.query?.api);
    if (!apiId) {
      throw new UnauthorizedException();
    }

    const usage = await this.apiService.getUsage(apiId);
    const maxWeight = 100;
    const allowed = usage + weight <= maxWeight;
    if (!allowed) {
      throw new Error('RATE_LIMIT');
    }

    // TODO: more reasonable message
    // TODO: Move after request
    await this.apiService.addRequest(apiId, `Called Api`, weight);
    return true;
  }
}
