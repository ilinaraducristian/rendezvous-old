import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { KeycloakUser } from "../../types";
import { AppService } from "../../app.service";

@Controller('users')
export class UsersController {

  constructor(private readonly appService: AppService) {
  }


}
