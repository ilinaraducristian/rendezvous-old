import KcAdminClient from "@keycloak/keycloak-admin-client";
import { Credentials } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import { Injectable } from "@nestjs/common";

const authOptions: Credentials = {
  username: "admin",
  password: "admin",
  grantType: "password",
  clientId: "admin-cli",
};

@Injectable()
export class KeycloakAdminService {
  private readonly kcAdminClient: KcAdminClient = new KcAdminClient({ realmName: "master" });

  constructor() {
    this.kcAdminClient.auth(authOptions).catch((e) => console.error(e));
  }

  getUser(userId: string) {
    return this.kcAdminClient.users
      .findOne({ id: userId, realm: "rendezvous" })
      .catch((e) => this.kcAdminClient.auth(authOptions).then(() => this.kcAdminClient.users.findOne({ id: userId, realm: "rendezvous" })));
  }
}
