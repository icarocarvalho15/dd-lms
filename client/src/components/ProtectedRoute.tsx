import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;