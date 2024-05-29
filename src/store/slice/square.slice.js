import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    squares: []
}

export const SquareSlice = createSlice({
    name: "square",
    initialState,
    reducers: {
        squareAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        }
    }
});

export const { squareAction } = SquareSlice.actions;
export default SquareSlice.reducer;