const Loading = () => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
			<div className="flex space-x-2">
				<div className="w-4 h-4 bg-sky-400 rounded-full animate-pulse"></div>
				<div className="w-4 h-4 bg-sky-500 rounded-full animate-pulse delay-200"></div>
				<div className="w-4 h-4 bg-sky-600 rounded-full animate-pulse delay-400"></div>
			</div>
		</div>
	);
};

export default Loading;
