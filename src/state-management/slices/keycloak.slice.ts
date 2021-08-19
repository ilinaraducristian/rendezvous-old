import {createSlice, SliceCaseReducers} from "@reduxjs/toolkit";

type KeycloakSliceState = {
  isAuthenticated: boolean,
  token: string,
  subject: string
}

export const keycloakSlice = createSlice<KeycloakSliceState, SliceCaseReducers<KeycloakSliceState>, string>({
  name: "keycloak",
  initialState: {
    isAuthenticated: false,
    token: "",
    subject: ""
  },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.subject = action.payload.subject;
    },
    deauthenticate(state) {
      state.isAuthenticated = false;
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