export interface Transaction {
	id: number;
	amount: number;
	rate: number;
	fromCurrency: string;
	toCurrency: string;
	convertedAmount: number;
	timestamp: string;
}

export interface ExchangeRateResponse {
	result: string;
	provider: string;
	documentation: string;
	terms_of_use: string;
	time_last_update_unix: number;
	time_last_update_utc: string;
	time_next_update_unix: number;
	time_next_update_utc: string;
	time_eol_unix: number;
	base_code: string;
	rates: Record<string, number>;
}
export interface ConversionRequest {
	fromCurrency: string;
	toCurrency: string;
	amount: number;
}

export interface ConversionResponse {
	convertedAmount: number;
	rate: number;
	amount: number;
	fromCurrency: string;
	toCurrency: string;
}
