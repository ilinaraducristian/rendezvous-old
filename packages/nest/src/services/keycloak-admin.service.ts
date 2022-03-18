import KcAdminClient from "@keycloak/keycloak-admin-client";
import { Credentials } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KeycloakAdminService {
  private readonly kcAdminClient: KcAdminClient;
  private readonly authOptions: Credentials;

  constructor(private readonly configService: ConfigService) {
    this.kcAdminClient = new KcAdminClient({ baseUrl: configService.get<string>("KEYCLOAK_AUTH_URL"), realmName: "master" });
    this.authOptions = {
      username: configService.get<string>("KEYCLOAK_ADMIN_USERNAME"),
      password: configService.get<string>("KEYCLOAK_ADMIN_PASSWORD"),
      grantType: "password",
      clientId: configService.get<string>("KEYCLOAK_ADMIN_CLIENT_ID"),
    };
    this.kcAdminClient.auth(this.authOptions).catch((e) => console.error(e));
  }

  async getUser(userId: string) {
    try {
      return await this.kcAdminClient.users.findOne({ id: userId, realm: this.configService.get<string>("KEYCLOAK_REALM") });
    } catch {
      await this.kcAdminClient.auth(this.authOptions);
      return this.kcAdminClient.users.findOne({ id: userId, realm: this.configService.get<string>("KEYCLOAK_REALM") });
    }
  }
}
