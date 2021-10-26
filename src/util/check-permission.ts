import Keycloak from "keycloak-js";
import {Server} from "../dtos/server.dto";
import {Role} from "../dtos/role.dto";

function checkPermission(initialized: boolean, keycloak: Keycloak.KeycloakInstance, selectedServer: Server | undefined, permission: keyof Role) {
    if (!initialized || !keycloak.authenticated || keycloak.userInfo === undefined || selectedServer === undefined) return;
    const userId = (keycloak.userInfo as any).sub;
    const member = selectedServer.members.find(member => member.userId === userId);
    if (member === undefined) return;
    const memberRolesWithGivenPermission = member.roles.map(roleId => selectedServer.roles.find(role => role.id === roleId))
        .filter(role => {
            if (role === undefined) return false;
            return role[permission];
        }).length;
    if (memberRolesWithGivenPermission === 0) return;
    return true;
}

export default checkPermission;