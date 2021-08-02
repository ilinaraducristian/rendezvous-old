import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import keycloakReducer from "./slices/keycloakSlice";
import socketioReducer from "./slices/socketioSlice";
import mediasoupReducer from "./slices/mediasoupSlice";
import serversDataReducer from "./slices/serversDataSlice";
import {socketioApi} from "./apis/socketio";
import {httpApi} from "./apis/http";

export const store = configureStore({
  reducer: {
    keycloak: keycloakReducer,
    socketio: socketioReducer,
    mediasoup: mediasoupReducer,
    serversData: serversDataReducer,
    [socketioApi.reducerPath]: socketioApi.reducer,
    [httpApi.reducerPath]: httpApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
      .concat(socketioApi.middleware, httpApi.middleware),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
