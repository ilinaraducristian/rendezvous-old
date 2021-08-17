import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import keycloakReducer from "state-management/slices/keycloakSlice";
import socketioReducer from "state-management/slices/socketioSlice";
import mediasoupReducer from "state-management/slices/mediasoupSlice";
import serversReducer from "state-management/slices/serversSlice";
import {socketioApi} from "state-management/apis/socketio";

export const store = configureStore({
  reducer: {
    keycloak: keycloakReducer,
    socketio: socketioReducer,
    mediasoup: mediasoupReducer,
    servers: serversReducer,
    [socketioApi.reducerPath]: socketioApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
      .concat(socketioApi.middleware),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
