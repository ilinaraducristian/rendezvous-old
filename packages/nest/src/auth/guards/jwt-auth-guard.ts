import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowUnauthorizedRequest = this.reflector.get<boolean>("allowUnauthorizedRequest", context.getHandler());
    return allowUnauthorizedRequest || super.canActivate(context);
  }
}
