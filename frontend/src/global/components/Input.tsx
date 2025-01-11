import { InputProps } from '../@types'

const Input = ({ label, register, error, ...props }: InputProps) => {
	return (
		<div className='w-full flex flex-col space-y-2'>
			<label className='text-xl font-thin'>{label}</label>
			<input
				{...props}
				{...register}
				className='bg-transparent p-3 text-lg border border-sky-950 rounded-md outline-none'
			/>
			{error && <p className='text-rose-500 text-sm'>{error}</p>}
		</div>
	)
}

export default Input
