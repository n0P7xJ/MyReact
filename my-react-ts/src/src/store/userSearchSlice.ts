import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface State {
    searchParams: string;
}

const initialState: State = {
    searchParams: "",
};

export const userSearchSlice = createSlice({
    name: 'userSearch',
    initialState,
    reducers: {
        setSearchParams: (state, action: PayloadAction<string>) => {
            state.searchParams = action.payload;
        },
    },
});

export const { setSearchParams } = userSearchSlice.actions;
export default userSearchSlice.reducer;  // **обов'язково експорт дефолт**
