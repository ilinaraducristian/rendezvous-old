import {BaseQueryFn, createApi} from "@reduxjs/toolkit/dist/query/react";
import socket from "../../socketio";
import {ProcessedServersData} from "../../types";
import {responseToSortedMap} from "../../util/functions";

const socketioBaseQuery = (): BaseQueryFn<{
  ev: string
  data?: any
}, unknown, unknown> => async ({ev, data}) => socket.emitAck(ev, data);

export const socketioApi = createApi({
  reducerPath: "socketioApi",
  baseQuery: socketioBaseQuery(),
  endpoints: (builder) => ({
    getUserServersData: builder.query<ProcessedServersData, void>({
      query: () => ({ev: "get_user_servers_data"}),
      transformResponse: responseToSortedMap
    }),
    joinServer: builder.query<ProcessedServersData, string>({
      query: (invitation) => ({ev: "join_server", data: {invitation}}),
      transformResponse: responseToSortedMap
    }),
    // TODO
    createServer: builder.query<ProcessedServersData, string>({
      query: (name) => ({ev: "create_server", data: {name}}),
      transformResponse: responseToSortedMap
    }),
    // TODO
    createChannel: builder.query<any, { serverId: number, groupId: number | null, channelName: string }>({
      query: (data) => ({ev: "create_channel", data}),
      transformResponse: responseToSortedMap
    }),
    // TODO
    createGroup: builder.query<any, { serverId: number, groupName: string }>({
      query: (data) => ({ev: "create_group", data}),
      transformResponse: responseToSortedMap
    }),
  }),
});

export const {
  useGetUserServersDataQuery,
  useJoinServerQuery,
  useCreateServerQuery,
  useCreateChannelQuery,
  useCreateGroupQuery,
} = socketioApi;