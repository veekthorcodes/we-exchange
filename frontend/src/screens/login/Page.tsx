/* eslint-disable react-hooks/exhaustive-deps */

import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../global/components/Input';
import Button from '../../global/components/Button';
import { useLoginMutation } from '../../global/redux/apiSlice';
import { useDispatch } from 'react-redux';
import { selectAuthState, setAuthState } from '../../global/redux/slices/authSlice';
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Loading from '../../global/components/Loading';

const schema = z.object({
	username: z.string().min(3, "name is required"),
	password: z.string().min(6, "password is required")
})

export type LoginFormValues = z.infer<typeof schema>;

const LoginPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(schema) })
	const [login, { isLoading, error }] = useLoginMutation()
	const dispatch = useDispatch()

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const res = await login(data).unwrap()
			dispatch(setAuthState({ ...res }))
		} catch (err) {
			console.error(err)
		}
	}

	const { accessToken } = useSelector(selectAuthState)
	const navigate = useNavigate()

	useEffect(() => {
		if (accessToken) {
			navigate('/dashboard')
		}
	}, [accessToken])

	return (
		<>
			{isLoading && <Loading />}
			<div className='relative w-3/5 mx-auto flex flex-col space-y-5 mt-16 p-10 rounded-md'>
				<div className="absolute inset-0 bg-slate-800 opacity-10 shadow-sm shadow-sky-300 rounded-md pointer-events-none"></div>
				<div>
					<h3 className='text-5xl mb-10 text-center'>Login to your account</h3>
				</div>
				<form className='flex flex-col space-y-5' onSubmit={handleSubmit(onSubmit)}>
					{error && <p className='text-rose-500'>Authentication failed, please check credentials</p>}
					<Input
						type='text'
						label='Username'
						register={register("username")}
						error={errors.username?.message}
					/>
					<Input
						label='Password'
						register={register("password")}
						error={errors.password?.message}
						type='password'
					/>
					<Button text={'Login'} />
				</form>
			</div>
		</>

	)
}

export default LoginPage
