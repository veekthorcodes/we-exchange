import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversionState {
	fromCurrency: string | null,
	amount: number | null,
	toCurrency: string | null,
	convertedAmount: number | null
}

const initialState: ConversionState = {
	fromCurrency: null,
	amount: null,
	toCurrency: null,
	convertedAmount: null
}

const conversionSlice = createSlice({
	name: 'conversion',
	initialState,
	reducers: {
		setConversionState: (state, action: PayloadAction<ConversionState>) => {
			return { ...state, ...action.payload };
		},

	}
})

export const { setConversionState } = conversionSlice.actions
export const selectConversionState = (state: { conversion: ConversionState }) => state.conversion

export default conversionSlice.reducer
