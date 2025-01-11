import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	username: string | null;
	accessToken: string | null;
}

const initialState: AuthState = {
	username: null,
	accessToken: null
}


const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthState: (state, action: PayloadAction<AuthState>) => {
			return { ...state, ...action.payload };
		},
		clearAuthState: () => {
			return initialState
		}
	}
})

export const { setAuthState, clearAuthState } = authSlice.actions;
export const selectAuthState = (state: { auth: AuthState }) => state.auth

export default authSlice.reducer
