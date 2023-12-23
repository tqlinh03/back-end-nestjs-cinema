import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'ResponseMessage';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

  export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );
  