import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { clearAuthState, selectAuthState } from "../../global/redux/slices/authSlice"
import TransactionHistory from "./components/TransactionHistory"
import { FaUserAlt } from "react-icons/fa";

const DashboardPage = () => {
	const { accessToken, username } = useSelector(selectAuthState)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		if (!accessToken) {
			navigate('/')
		}
	}, [accessToken, navigate])

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl">Dashboard</h1>
				<div className="flex items-center space-x-2 px-4 py-2 border rounded-full text-sm">
					<FaUserAlt />
					<p>{username}</p>
				</div>
				<button onClick={() => dispatch(clearAuthState())}>logout</button>
			</div>

			<div>
				<TransactionHistory />
			</div>
		</div >
	)
}

export default DashboardPage
