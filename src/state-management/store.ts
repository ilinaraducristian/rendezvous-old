import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import socketioReducer from "state-management/slices/socketio.slice";
import mediasoupReducer from "state-management/slices/mediasoup.slice";
import dataReducer from "state-management/slices/data/data.slice";
import {socketioApi} from "state-management/apis/socketio.api";
import {httpApi} from "state-management/apis/http.api";

export const store = configureStore({
  reducer: {
    socketio: socketioReducer,
    mediasoup: mediasoupReducer,
    data: dataReducer,
    [socketioApi.reducerPath]: socketioApi.reducer,
    [httpApi.reducerPath]: httpApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
      .concat([socketioApi.middleware, httpApi.middleware]),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
