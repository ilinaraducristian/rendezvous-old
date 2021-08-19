function AuthProvider({children}: any) {
  // if (process.env.REACT_APP_ENVIRONMENT === "production") {
  //   return (
  //       <Auth0Provider
  //           domain="rendezvous-iam.eu.auth0.com"
  //           clientId="l1ZnZCOMXFKzMO0plbn0dl4o6Ijyg0se"
  //           redirectUri={window.location.origin}
  //       >
  //         {children}
  //       </Auth0Provider>
  //   );
  // }
  return children;

}

export default AuthProvider;