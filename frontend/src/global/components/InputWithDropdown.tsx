import { InputWithDropdownProps } from '../@types';

const InputWithDropdown = ({ label, register, dropdownRegister, error, dropdownError, options, ...props }: InputWithDropdownProps) => {

	return (
		<div className='w-full flex flex-col space-y-2'>
			<label className='text-xl font-thin'>{label}</label>
			<div className='flex w-full relative items-center justify-center'>
				<input
					{...register}
					readOnly={props.readOnly}
					className='h-14 bg-transparent p-3 text-lg border-l border-t border-b border-sky-950 rounded-l-md rounded-t-sm rounded-b-sm w-full outline-none'
				/>
				<select
					{...dropdownRegister}

					className={`h-14 bg-slate-600 p-3 text-lg border-r border-t border-b border-sky-950 rounded-r-md rounded-t-sm rounded-b-sm outline-none`}
				>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
			{error && <p className='text-rose-500 text-sm'>{error}</p>}
			{dropdownError && <p className='text-rose-500 text-sm'>{dropdownError}</p>}
		</div>
	);
};

export default InputWithDropdown
