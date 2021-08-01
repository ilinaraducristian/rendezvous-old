import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {Message} from "../../types";
import config from "../../config";
import SortedMap from "../../util/SortedMap";
import {RootState} from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: config.backend,
  prepareHeaders: (headers, {getState}) => {
    const authenticated = (getState() as RootState).keycloak.authenticated;
    const token = (getState() as RootState).keycloak.token;
    if (authenticated) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const httpApi = createApi({
  reducerPath: "httpApi",
  baseQuery,
  endpoints: (builder) => ({
    getMessages: builder.query<SortedMap<Message>, { [key: string]: number }>({
      query: ({channelId, serverId, offset}) => ({
        url: `channels/${channelId}/messages?serverId=${serverId}&offset=${offset}`,
      }),
      transformResponse: (response: [number, Message][]) => {
        return new SortedMap<Message>(response.map((message: [number, Message]) => {
          message[1].timestamp = new Date(message[1].timestamp);
          return message;
        }));
      }
    }),
    createInvitation: builder.query<string, number>({
      query: (serverId) => ({
        url: `invitations`,
        method: "POST",
        body: {serverId}
      }),
      transformResponse: (response: { invitation: string }) => response.invitation
    }),
  }),
});

export const {useGetMessagesQuery, useCreateInvitationQuery} = httpApi;