import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import keycloak from "keycloak";
import config from "config";

export const httpApi = createApi({
  reducerPath: "httpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.backend, prepareHeaders: async (headers) => {
      headers.set("authorization", `Bearer ${await keycloak.getToken()}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.query<string, void>({
      query: () => "login",
      transformResponse: ({token}) => token
    }),
  }),
});

export const {useLazyLoginQuery} = httpApi;