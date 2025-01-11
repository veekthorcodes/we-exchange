
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { clearAuthState } from "./slices/authSlice";
import { LoginResponse } from "../../screens/login/@types";
import { LoginFormValues } from "../../screens/login/Page";
import { ConversionRequest, ConversionResponse, ExchangeRateResponse, Transaction } from "../../screens/dashboard/@types";

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
	tagTypes: ["Transactions"],
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
			providesTags: ["Transactions"]
		}),
		getExchangeRates: build.query<ExchangeRateResponse, void>({
			query: () => ({
				method: 'GET',
				url: '/exchange-rates'
			})
		}),
		convert: build.mutation<ConversionResponse, ConversionRequest>({
			query: (data) => ({
				method: 'POST',
				url: '/convert',
				body: data
			}),
			invalidatesTags: ['Transactions']
		}),
	})
})

export const { useLoginMutation, useGetTransactionsQuery, useGetExchangeRatesQuery, useConvertMutation } = apiSlice 
