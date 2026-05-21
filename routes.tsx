import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Viviendas } from './pages/Viviendas';
import { Pagos } from './pages/Pagos';
import { Distribucion } from './pages/Distribucion';
import { NivelTanque } from './pages/NivelTanque';
import { Turnos } from './pages/Turnos';
import { Incidencias } from './pages/Incidencias';
import { Reportes } from './pages/Reportes';
import { MiServicio } from './pages/MiServicio';
import { Notificaciones } from './pages/Notificaciones';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'viviendas',
        element: <Viviendas />,
      },
      {
        path: 'pagos',
        element: <Pagos />,
      },
      {
        path: 'distribucion',
        element: <Distribucion />,
      },
      {
        path: 'nivel-tanque',
        element: <NivelTanque />,
      },
      {
        path: 'turnos',
        element: <Turnos />,
      },
      {
        path: 'incidencias',
        element: <Incidencias />,
      },
      {
        path: 'reportes',
        element: <Reportes />,
      },
      {
        path: 'mi-servicio',
        element: <MiServicio />,
      },
      {
        path: 'notificaciones',
        element: <Notificaciones />,
      },
    ],
  },
]);
