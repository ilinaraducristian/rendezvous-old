import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import keycloak from "keycloak";

export const httpApi = createApi({
  reducerPath: "httpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3100/", prepareHeaders: async (headers) => {
      headers.set("authorization", `Bearer ${await keycloak.getToken()}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.query<string, void>({
      query: () => "login",
      transformResponse(response: any) {
        console.log(response);
        return response.token;
      }
    }),
  }),
});

export const {useLazyLoginQuery} = httpApi;