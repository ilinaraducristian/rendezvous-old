import KcAdminClient from "@keycloak/keycloak-admin-client";
import { Credentials } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import { Injectable } from "@nestjs/common";

const authOptions: Credentials = {
  username: process.env.KEYCLOAK_ADMIN_USERNAME || "",
  password: process.env.KEYCLOAK_ADMIN_PASSWORD || "",
  grantType: "password",
  clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || "",
};

@Injectable()
export class KeycloakAdminService {
  private readonly kcAdminClient: KcAdminClient = new KcAdminClient({ baseUrl: process.env.KEYCLOAK_AUTH_URL, realmName: "master" });

  constructor() {
    this.kcAdminClient.auth(authOptions).catch((e) => console.error(e));
  }

  getUser(userId: string) {
    return this.kcAdminClient.users
      .findOne({ id: userId, realm: "rendezvous" })
      .catch((e) => this.kcAdminClient.auth(authOptions).then(() => this.kcAdminClient.users.findOne({ id: userId, realm: "rendezvous" })));
  }
}
