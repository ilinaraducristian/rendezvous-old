import {createSlice} from "@reduxjs/toolkit";

export const keycloakSlice = createSlice({
  name: "keycloak",
  initialState: {
    authenticated: false,
    token: "",
    subject: ""
  },
  reducers: {
    authenticate(state, action) {
      state.authenticated = true;
      state.token = action.payload.token;
      state.subject = action.payload.subject;
    },
    deauthenticate(state) {
      state.authenticated = false;
      state.token = "";
      state.subject = "";
    },
    updateToken(state, action) {
      state.token = action.payload.token;
    }
  }
});

export const {authenticate, deauthenticate, updateToken} = keycloakSlice.actions;
export const selectAuthenticated = (state: any): boolean => state.keycloak.authenticated;
export const selectSubject = (state: any): string => state.keycloak.subject;

export default keycloakSlice.reducer;