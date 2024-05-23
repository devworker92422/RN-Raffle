import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dbFlag: false
};

export const DataBaseSlice = createSlice({
    name: "database",
    initialState,
    reducers: {
        dbAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        }
    }
});

export const { dbAction } = DataBaseSlice.actions;
export default DataBaseSlice.reducer;

