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
import AbrirCaja from './pages/Admin/AbrirCaja';
import CierreCaja from './pages/Admin/CierreCaja';
import Productos from './pages/Admin/Productos';
import Informes from './pages/Admin/Informes';
import PantallaAcceso from './pages/Admin/PantallaAcceso';
import PantallaRutinas from './pages/Admin/PantallaRutinas';
import Configuracion from './pages/Admin/Configuracion';
import NuevoPago from './pages/Admin/NuevoPago';
import NuevaRutina from './pages/Admin/NuevaRutina';
import CuentaCorriente from './pages/Admin/CuentaCorriente';
import Clases from './pages/Admin/Clases';
import AlumnoInicio from './pages/Alumno/Inicio';
import Nutricion from './pages/Admin/Nutricion';
import Medidas from './pages/Admin/Medidas';
import Asistencia from './pages/Admin/Asistencia';
import Avisos from './pages/Admin/Avisos';
import Imagenes from './pages/Admin/Imagenes';
import Beneficios from './pages/Admin/Beneficios';
import Cobros from './pages/Admin/Cobros';
import InformeVentas from './pages/Admin/InformeVentas';
import MovimientoCaja from './pages/Admin/MovimientoCaja';
import Ingresos from './pages/Admin/Ingresos';
import MapaCalor from './pages/Admin/MapaCalor';
import Generales from './pages/Admin/Generales';
import Personalizacion from './pages/Admin/Personalizacion';
import Usuarios from './pages/Admin/Usuarios';
import Permisos from './pages/Admin/Permisos';

// Alumno Pages
// import AlumnoRutina from './pages/Alumno/Rutina';
import AlumnoTurnos from './pages/Alumno/Turnos';
// import AlumnoPagos from './pages/Alumno/Pagos';
// import Imagenes from './pages/Admin/Imagenes';

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
          <Route path="abrir-caja" element={<AbrirCaja />} />
          <Route path="cierre-caja" element={<CierreCaja />} />
          <Route path="avisos" element={<Avisos />} />
          <Route path="imagenes" element={<Imagenes />} />
          <Route path="beneficios" element={<Beneficios />} />
          <Route path="productos" element={<Productos />} />
          <Route path="informes" element={<Informes />} />
          <Route path="informe-ventas" element={<InformeVentas />} />
          <Route path="movimiento-caja" element={<MovimientoCaja />} />
          <Route path="cobros" element={<Cobros />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="mapa-calor" element={<MapaCalor />} />
          <Route path="cuenta-corriente" element={<CuentaCorriente />} />
          <Route path="pantalla-acceso" element={<PantallaAcceso />} />
          <Route path="pantalla-rutinas" element={<PantallaRutinas />} />
          <Route path="generales" element={<Generales />} />
          <Route path="personalizacion" element={<Personalizacion />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="permisos" element={<Permisos />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      )}
    </Routes>
  );
};

export default Router;
