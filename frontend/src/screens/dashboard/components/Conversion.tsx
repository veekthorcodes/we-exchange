/* eslint-disable react-hooks/exhaustive-deps */
import { AiOutlineSwap } from "react-icons/ai";
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../../global/components/Button'
import InputWithDropdown from '../../../global/components/InputWithDropdown';
import { useEffect, useState } from "react";
import { ExchangeRateResponse } from "../@types";
import { useConvertMutation, useGetExchangeRatesQuery } from "../../../global/redux/apiSlice";
import { useDispatch } from "react-redux";
import { setConversionState } from "../../../global/redux/slices/conversionSlice";
import { fromCurrencies, toCurrencies } from "../utils";
import Loading from "../../../global/components/Loading";

const schema = z.object({
	fromCurrency: z.string().min(1),
	amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Please enter a valid number greater than 0"
	}).transform((val) => Number(val)),
	toCurrency: z.string().min(1),
	convertedAmount: z.number().refine((val) => val >= 0, {
		message: "Please enter a valid number"
	})
});


type ConversionFormValues = z.infer<typeof schema>

const Conversion = () => {
	const [exchangeRates, setExchangeRates] = useState<ExchangeRateResponse>()
	const { data, isLoading: fetchingRates } = useGetExchangeRatesQuery()
	const [convert, { isLoading: converting }] = useConvertMutation()
	const dispatch = useDispatch()

	const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<ConversionFormValues>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			fromCurrency: fromCurrencies[0],
			toCurrency: toCurrencies[0]
		}
	})
	const fromCurrency = useWatch({ control, name: 'fromCurrency' });
	const amount = useWatch({ control, name: 'amount' });
	const toCurrency = useWatch({ control, name: 'toCurrency' });

	const onSubmit = async (data: ConversionFormValues) => {
		try {
			const res = await convert({
				amount: data.amount,
				fromCurrency: data.fromCurrency,
				toCurrency: data.toCurrency
			}).unwrap()
			dispatch(setConversionState({ ...res }))
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		setExchangeRates(data)
	}, [data])

	useEffect(() => {
		(async () => {
			if (amount) {
				const fromRate = exchangeRates?.rates[fromCurrency];
				const toRate = exchangeRates?.rates[toCurrency];
				if (fromRate && toRate) {
					const converted = (amount / fromRate) * toRate
					setValue('convertedAmount', converted);
				}
			}
		})()
	}, [amount, fromCurrency, toCurrency])

	return (
		<>
			{converting && <Loading />}
			<div className='flex flex-col my-16 bg-slate-500 text-slate-80 p-5 rounded-xl'>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-10'>
					<div className="flex justify-center items-center space-x-10">
						<InputWithDropdown
							register={register('amount')}
							error={errors?.amount?.message}
							dropdownRegister={register('fromCurrency')}
							dropdownError={errors.fromCurrency?.message}
							placeholder='From'
							options={fromCurrencies}
						/>
						<div className='flex justify-center items-center'>
							<AiOutlineSwap className='text-6xl' />
						</div>
						<InputWithDropdown
							register={register('convertedAmount')}
							error={errors?.convertedAmount?.message}
							dropdownRegister={register('toCurrency')}
							dropdownError={errors.toCurrency?.message}
							placeholder='To'
							options={toCurrencies}
							readOnly={true}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div>
							{fetchingRates ? (
								<div className="w-96 h-14 bg-slate-400 rounded-md animate-pulse"></div>
							) : (
								exchangeRates?.rates?.[fromCurrency] && exchangeRates?.rates?.[toCurrency] ? (
									<p className="text-xl font-bold">
										{exchangeRates.rates[fromCurrency]} {fromCurrency} = {exchangeRates.rates[toCurrency].toFixed(3)} {toCurrency}
									</p>
								) : (
									<p className="text-xl text-pulse-500">Unable to fetch exchange rates.</p>
								)
							)}
						</div>
						<Button text={'Convert'} />
					</div>
				</form>
			</div >
		</>
	)
}

export default Conversion
