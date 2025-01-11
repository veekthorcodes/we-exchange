import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { UseFormRegisterReturn } from 'react-hook-form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	register: UseFormRegisterReturn;
	error?: string;
}

export interface InputWithDropdownProps extends InputProps {
	dropdownRegister: UseFormRegisterReturn;
	dropdownError?: string;
	options: string[];
}

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	text: string;
	isLoading?: boolean;
	icon?: ReactNode;
}
