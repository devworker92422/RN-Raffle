import { configureStore } from "@reduxjs/toolkit";
import settingSlice from "./slice/setting.slice";
import dbSlice from "./slice/db.slice";
import squareSlice from "./slice/square.slice";

export const store = configureStore({
    reducer: {
        setting: settingSlice,
        dataBase: dbSlice,
        square: squareSlice
    }
});