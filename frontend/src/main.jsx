import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Comentario from '@pages/Comentarios';
import '@styles/styles.css';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error404 />,
        children: [
            {
                path: '/home',
                element: <Home />
            },
            {
                path: '/users',
                element: (
                    <ProtectedRoute allowedRoles={['administrador']}>
                        <Users />
                    </ProtectedRoute>
                )
            },
            {
                path: '/comentarios',
                element: (
                    <ProtectedRoute allowedRoles={['estudiante', 'docente']}>
                        <Comentario />
                    </ProtectedRoute>
                )
            }
        ]
    },
    {
        path: '/auth',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
);