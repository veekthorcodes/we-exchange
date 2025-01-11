import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { selectAuthState } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { accessToken } = useSelector(selectAuthState);

	if (!accessToken) {
		return <Navigate to="/" />;
	}

	return children;
};

export default ProtectedRoute;
