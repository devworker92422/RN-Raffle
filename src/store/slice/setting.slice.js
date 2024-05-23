import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    price: null,
    profit: null,
    endDate: null,
    createAt: null,
    isFinished: null,
    squares: 0
}

const SettingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        settingAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        }
    }
})

export const { settingAction } = SettingSlice.actions;
export default SettingSlice.reducer;