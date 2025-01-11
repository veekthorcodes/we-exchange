import { format } from "date-fns";
import { Transaction } from "../@types";

export const historyTalbleOptions: { header: string, value: keyof Transaction }[] = [
	{ header: "From ", value: "fromCurrency" },
	{ header: "Amount", value: "amount" },
	{ header: "To ", value: "toCurrency" },
	{ header: "Converted Amount", value: "convertedAmount" },
	{ header: "Rate", value: "rate" },
	{ header: "Date", value: "timestamp" }
];

export const formatValue = (value: unknown, key: keyof Transaction): string => {
	if (key === 'timestamp' && typeof value === 'string') {
		return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
	}
	const numberFields = new Set<keyof Transaction>(['convertedAmount', 'rate',]);
	if (numberFields.has(key) && typeof value === 'string') {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			return numericValue.toFixed(3);
		}
	}
	return String(value);
};

export const fromCurrencies = ["USD"]
export const toCurrencies = ["GHS", "NGN", "GBP", "EUR"]
