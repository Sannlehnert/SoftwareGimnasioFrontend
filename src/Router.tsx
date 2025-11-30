import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import AlumnoLayout from './components/layout/AlumnoLayout';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import Alumnos from './pages/Admin/Alumnos';
import NuevoAlumno from './pages/Admin/NuevoAlumno';
import AlumnoDetail from './pages/Admin/AlumnoDetail';
import Rutinas from './pages/Admin/Rutinas';
import Turnos from './pages/Admin/Turnos';
import Caja from './pages/Admin/Caja';
import Productos from './pages/Admin/Productos';

import Informes from './pages/Admin/Informes';
import PantallaAcceso from './pages/Admin/PantallaAcceso';
import Configuracion from './pages/Admin/Configuracion';
import NuevoPago from './pages/Admin/NuevoPago';
import NuevaRutina from './pages/Admin/NuevaRutina';
import CuentaCorriente from './pages/Admin/CuentaCorriente';
import Clases from './pages/Admin/Clases';
import AlumnoInicio from './pages/Alumno/Inicio';
import Nutricion from './pages/Admin/Nutricion';
import Medidas from './pages/Admin/Medidas';
import Asistencia from './pages/Admin/Asistencia';

// Alumno Pages
// import AlumnoRutina from './pages/Alumno/Rutina';
import AlumnoTurnos from './pages/Alumno/Turnos';
// import AlumnoPagos from './pages/Alumno/Pagos';

const Router = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : user.rol === 'ALUMNO' ? (
        <Route path="/*" element={<AlumnoLayout />}>
          <Route index element={<Navigate to="inicio" />} />
          <Route path="inicio" element={<AlumnoInicio />} />
          {/* <Route path="rutina" element={<AlumnoRutina />} />
          <Route path="turnos" element={<AlumnoTurnos />} />
          <Route path="pagos" element={<AlumnoPagos />} /> */}
        </Route>
      ) : (
        <Route path="/*" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alumnos" element={<Alumnos />} />
          <Route path="alumnos/nuevo" element={<NuevoAlumno />} />
          <Route path="alumnos/:id" element={<AlumnoDetail />} />
          <Route path="pagos/nuevo" element={<NuevoPago />} />
          <Route path="rutinas" element={<Rutinas />} />
          <Route path="rutinas/nueva" element={<NuevaRutina />} />
          <Route path="turnos" element={<Turnos />} />
          <Route path="turnos-alumno" element={<AlumnoTurnos />} />
          <Route path="clases" element={<Clases />} />
          <Route path="nutricion" element={<Nutricion />} />
          <Route path="medidas" element={<Medidas />} />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="caja" element={<Caja />} />
          <Route path="productos" element={<Productos />} />

          <Route path="informes" element={<Informes />} />
          <Route path="cuenta-corriente" element={<CuentaCorriente />} />
          <Route path="pantalla-acceso" element={<PantallaAcceso />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      )}
    </Routes>
  );
};

export default Router;
