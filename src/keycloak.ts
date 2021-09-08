import Keycloak, {KeycloakInstance} from "keycloak-js";
import config from "config";
import createAuth0Client, {Auth0Client} from "@auth0/auth0-spa-js";

class AuthClient {

  private authInstance: KeycloakInstance | Auth0Client;
  private isProduction: boolean = false;//process.env.REACT_APP_ENVIRONMENT === "production";

  constructor() {
    if (this.isProduction) {
      this.authInstance = new Auth0Client({
        useRefreshTokens: true,
        ...config.auth0,
      });
    } else {
      // @ts-ignore
      this.authInstance = new Keycloak(config.keycloak);
    }
  }

  private _token: string = "";

  get token(): string {
    return this._token;
  }

  async init() {
    let isAuthenticated: boolean = false;
    if (this.isProduction) {
      this.authInstance = await createAuth0Client({
        useRefreshTokens: true,
        ...config.auth0,
      });
      isAuthenticated = await this.authInstance.isAuthenticated();
      if (!isAuthenticated) await this.authInstance.loginWithRedirect({redirect_uri: window.location.origin});
      else this._token = await this.authInstance.getTokenSilently();
    } else {
      isAuthenticated = await (this.authInstance as KeycloakInstance).init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html"
      });
      if (!isAuthenticated) await (this.authInstance as KeycloakInstance).login();
      else this._token = (this.authInstance as KeycloakInstance).token || "";
    }
    return isAuthenticated;
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.isProduction)
      return (this.authInstance as Auth0Client).isAuthenticated();
    const isAuthenticated = (this.authInstance as KeycloakInstance).authenticated;
    if (isAuthenticated === undefined) return Promise.resolve(false);
    await (this.authInstance as KeycloakInstance).loadUserProfile();
    return Promise.resolve(isAuthenticated);
  }

  getToken(): Promise<string> {
    if (this.isProduction)
      return (this.authInstance as Auth0Client).getTokenSilently() as Promise<string>;
    const token = (this.authInstance as KeycloakInstance).token;
    if (token === undefined) return Promise.resolve("");
    return Promise.resolve(token);
  }

  async getSubject(): Promise<string> {
    if (this.isProduction) {
      const user = await (this.authInstance as Auth0Client).getUser();
      if (user === undefined) return "";
      if (user.sub === undefined) return "";
      return user.sub;
    }
    const subject = (this.authInstance as KeycloakInstance).subject;
    if (subject === undefined) return Promise.resolve("");
    return Promise.resolve(subject);
  }

  getUsername() {
    return (this.authInstance as KeycloakInstance).loadUserProfile();
  }

}

const authClient = new AuthClient();

export default authClient;