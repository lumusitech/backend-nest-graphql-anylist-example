import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  //! Override
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const request = ctx.getContext().req;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request;
  }
}
