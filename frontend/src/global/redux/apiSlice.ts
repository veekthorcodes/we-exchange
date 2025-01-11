
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { clearAuthState } from "./slices/authSlice";
import { LoginResponse } from "../../screens/login/@types";
import { LoginFormValues } from "../../screens/login/Page";
import { Transaction } from "../../screens/dashboard/@types";

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions
) => {
	const baseQuery = fetchBaseQuery({
		baseUrl: 'http://localhost:5050/',
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.accessToken;
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
			return headers;
		},
	});

	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(clearAuthState());
		window.location.href = '/';
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: (build) => ({
		login: build.mutation<LoginResponse, LoginFormValues>({
			query: (data) => ({
				method: 'POST',
				url: '/auth/login',
				body: data
			})
		}),
		getTransactions: build.query<Transaction[], void>({
			query: () => ({
				method: 'GET',
				url: '/user/transactions'
			}),
		})
	})
})

export const { useLoginMutation, useGetTransactionsQuery } = apiSlice 
