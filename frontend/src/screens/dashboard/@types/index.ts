export interface Transaction {
	id: number;
	amount: number;
	rate: number;
	fromCurrency: string;
	toCurrency: string;
	convertedAmount: number;
	timestamp: string;
}
