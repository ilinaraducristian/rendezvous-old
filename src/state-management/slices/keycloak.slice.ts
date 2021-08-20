import {createSlice, SliceCaseReducers} from "@reduxjs/toolkit";

type KeycloakSliceState = {
  isAuthenticated: boolean,
  subject: string
}

export const keycloakSlice = createSlice<KeycloakSliceState, SliceCaseReducers<KeycloakSliceState>, string>({
  name: "keycloak",
  initialState: {
    isAuthenticated: false,
    subject: ""
  },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.subject = action.payload;
    },
    deauthenticate(state) {
      state.isAuthenticated = false;
      state.subject = "";
    },
  }
});

export const {authenticate, deauthenticate} = keycloakSlice.actions;
export const selectAuthenticated = (state: any): boolean => state.keycloak.authenticated;
export const selectSubject = (state: any): string => state.keycloak.subject;

export default keycloakSlice.reducer;