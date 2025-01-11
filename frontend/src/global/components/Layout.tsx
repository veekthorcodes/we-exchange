import { Outlet } from "react-router"

function Layout() {
	return (
		<div className='bg-gradient-to-r from-black to-slate-800 text-sky-200'>
			<header className='flex items-center justify-center my-3 p-5 rounded-full shadow-sm shadow-sky-800'>
				<h1 className='text-2xl uppercase font-semibold'>We Exchange</h1>
			</header>
			<main className="mt-10 w-4/5 mx-auto flex flex-col">
				<Outlet />
			</main>
		</div>
	)
}

export default Layout
