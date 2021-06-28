docker exec -it server_auth_1 /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.realmName=capp \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.file=/tmp/capp.json

docker cp server_auth_1:/tmp/capp.json .