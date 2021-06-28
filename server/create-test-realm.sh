# login as admin
/opt/jboss/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin --password admin
# create a new realm
/opt/jboss/keycloak/bin/kcadm.sh create realms -s realm=capp -s enabled=true -o
# create a client for login
/opt/jboss/keycloak/bin/kcadm.sh create clients -r capp -s clientId=auth-code -s enabled=true -s publicClient=true -s "redirectUris=[\"*\"]" -s "webOrigins=[\"*\"]"
# create a new client for token introspection
/opt/jboss/keycloak/bin/kcadm.sh create clients -r capp -s clientId=token-introspection -s enabled=true -s publicClient=false -s standardFlowEnabled=false
# create 100 test users

create_user(){
  /opt/jboss/keycloak/bin/kcadm.sh create users --no-config --server http://localhost:8080/auth --realm master --user admin --password admin -r CAPP -s username="user$1" -s enabled=true -s email="user$1@email.com" -s firstName="User$1" -s lastName="Name$1" -s emailVerified=true
  # set user password
  /opt/jboss/keycloak/bin/kcadm.sh set-password --no-config --server http://localhost:8080/auth --realm master --user admin --password admin -r CAPP --username "user$1" --new-password "user$1"
}

for i in {1..100}
do
    create_user $i &
done

wait
echo "Users created"