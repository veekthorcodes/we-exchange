import { ButtonProps } from '../@types'

const Button = ({ text, type, }: ButtonProps) => {
	return (
		<button
			type={type}
			className='p-3 rounded-md bg-gray-800 hover:bg-slate-800 text-2xl border border-sky-950'
		>
			{text}
		</button>
	)
}

export default Button
