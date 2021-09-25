import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import dataReducer from "state-management/slices/data/data.slice";
import {httpApi} from "state-management/apis/http.api";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    [httpApi.reducerPath]: httpApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(httpApi.middleware),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
