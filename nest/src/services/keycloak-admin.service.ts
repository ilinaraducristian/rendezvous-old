import KcAdminClient from "@keycloak/keycloak-admin-client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class KeycloakAdminService {
  private readonly kcAdminClient: KcAdminClient;
  constructor() {
    this.kcAdminClient = new KcAdminClient();
    this.kcAdminClient.auth({
      username: "admin",
      password: "admin",
      grantType: "password",
      clientId: "admin-cli",
    });
  }

  getUser(userId: string) {
    return this.kcAdminClient.users.findOne({ id: userId });
  }
}
