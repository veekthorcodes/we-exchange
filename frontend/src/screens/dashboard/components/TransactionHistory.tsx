
import { useState } from 'react'
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useGetTransactionsQuery } from '../../../global/redux/apiSlice'
import { formatValue, historyTalbleOptions } from '../utils';
import Loading from '../../../global/components/Loading';


const TransactionHistory = () => {
	const { data, error, isLoading } = useGetTransactionsQuery();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 1;
	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const paginatedData = data
		? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
		: [];


	if (isLoading) return <Loading />;

	if (error) return <p className='text-center m-5'>Error fetching transaction history</p>;


	return (
		<div className="my-10">
			<h3 className="text-3xl font-thin mb-5">Your transaction history</h3>
			{data && data.length > 0 ? (
				<div>
					<table className="w-full border-collapse border-b border-slate-500">
						<thead>
							<tr>
								<th className="text-start border-b border-slate-500 px-4 py-2">{"ID"}</th>
								{historyTalbleOptions.map((option) => (
									<th key={option.value} className="text-start border-b border-slate-500 px-4 py-2">
										{option.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{paginatedData.map((transaction, rowIndex) => (
								<tr key={transaction.id || rowIndex} className="text-sm">
									<td className="border-b border-slate-800 px-4 py-2">
										{(currentPage - 1) * itemsPerPage + rowIndex + 1}
									</td>
									{historyTalbleOptions.map((option) => (
										<td key={option.value} className="border-b border-slate-800 px-4 py-2">
											{formatValue(transaction[option.value], option.value)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex justify-center space-x-10 items-center mt-4">
						<MdKeyboardDoubleArrowLeft
							className={`cursor-pointer ${currentPage === 1 && 'text-gray-400 cursor-not-allowed'}`}
							onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
						/>
						<p className='text-sm'>
							Page {currentPage} of {totalPages}
						</p>
						<MdKeyboardDoubleArrowRight
							className={`cursor-pointer ${currentPage === totalPages && 'text-gray-400 cursor-not-allowed'}`}
							onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)}
						/>
					</div>
				</div>
			) : (
				<p className='text-center m-5'>No transactions made</p>
			)}
		</div>
	);
};

export default TransactionHistory;
