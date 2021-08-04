import {BaseQueryFn, createApi} from "@reduxjs/toolkit/dist/query/react";
import socket from "../../socketio";
import {Message, ProcessedServersData} from "../../types";

const socketioBaseQuery = (): BaseQueryFn<{
  ev: string
  data?: any
}, any, unknown> => ({ev, data}) => socket.emitAck(ev, data).then(data => ({data}));

export const socketioApi = createApi({
  reducerPath: "socketioApi",
  baseQuery: socketioBaseQuery(),
  endpoints: (builder) => ({
    getUserServersData: builder.query<ProcessedServersData, void>({
      query: () => ({ev: "get_user_servers_data"})
    }),
    joinServer: builder.query<ProcessedServersData, string>({
      query: (invitation) => ({ev: "join_server", data: {invitation}})
    }),
    // TODO
    createServer: builder.query<ProcessedServersData, string>({
      query: (name) => ({ev: "create_server", data: {name}}),
      // transformResponse: responseToSortedMap
    }),
    // TODO
    createChannel: builder.query<any, { serverId: number, groupId: number | null, channelName: string }>({
      query: (data) => ({ev: "create_channel", data})
    }),
    // TODO
    createGroup: builder.query<any, { serverId: number, groupName: string }>({
      query: (data) => ({ev: "create_group", data})
    }),
    getMessages: builder.query<Message[], { [key: string]: number }>({
      query: (data) => ({ev: "get_messages", data})
    }),
    createInvitation: builder.query<string, number>({
      query: (serverId) => ({ev: "create_invitation", data: {serverId}}),
      transformResponse: (response: { invitation: string }) => response.invitation
    }),
  }),
});

export const {
  useLazyGetUserServersDataQuery,
  useLazyJoinServerQuery,
  useLazyCreateServerQuery,
  useLazyCreateChannelQuery,
  useLazyCreateGroupQuery,
  useLazyGetMessagesQuery,
  useLazyCreateInvitationQuery,
} = socketioApi;