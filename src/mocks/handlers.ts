import { http, HttpResponse } from 'msw';

const mockAlumnos = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nombre: `Alumno`,
  apellido: `Apellido ${i + 1}`,
  dni: (30000000 + i).toString(),
  email: `alumno${i + 1}@email.com`,
  telefono: `+54911${Math.random().toString().slice(2, 10)}`,
  fechaNacimiento: new Date(1990 + (i % 20), i % 12, (i % 28) + 1).toISOString(),
  direccion: `Calle Falsa ${i + 1}${i % 5 === 0 ? ', Piso ' + (i % 10) : ''}`,
  planId: (i % 3) + 1,
  plan: ['Full Mensual', 'Semestral', 'Drop-in'][i % 3],
  fechaIngreso: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
  fechaVencimiento: new Date(Date.now() + (i % 30 - 15) * 24 * 60 * 60 * 1000).toISOString(),
  estado: i % 10 === 0 ? 'SUSPENDIDO' : i % 15 === 0 ? 'INACTIVO' : 'ACTIVO',
  notas: i % 5 === 0 ? 'Alumno con observaciones especiales' : '',
}));

const mockClases = [
  {
    id: 1,
    nombre: 'Yoga',
    descripcion: 'Clase de yoga para principiantes',
    capacidad: 15,
    duracion: 60,
    color: '#10B981',
    activo: true,
    instructores: ['María García', 'Carlos López'],
  },
  {
    id: 2,
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor',
    capacidad: 20,
    duracion: 45,
    color: '#F59E0B',
    activo: true,
    instructores: ['Ana Rodríguez'],
  },
  {
    id: 3,
    nombre: 'Cross Funcional',
    descripcion: 'Entrenamiento funcional de alta intensidad',
    capacidad: 12,
    duracion: 50,
    color: '#EF4444',
    activo: true,
    instructores: ['Pedro Sánchez'],
  },
];

const mockTurnos = [
  {
    id: 1,
    claseId: 1,
    claseNombre: 'Yoga',
    fechaHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // mañana
    sala: 'Sala A',
    cupo: 15,
    inscritos: 8,
    instructor: 'María García',
    estado: 'ACTIVO',
  },
  {
    id: 2,
    claseId: 2,
    claseNombre: 'Spinning',
    fechaHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    sala: 'Sala B',
    cupo: 20,
    inscritos: 15,
    instructor: 'Ana Rodríguez',
    estado: 'ACTIVO',
  },
];

const mockProductos = [
  {
    id: 1,
    nombre: 'Proteína Whey 1kg',
    descripcion: 'Proteína de suero de leche premium',
    precioCompra: 15000,
    precioVenta: 22000,
    stock: 15,
    stockMinimo: 5,
    activo: true,
    categoria: 'Suplementos',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    nombre: 'Creatina 500g',
    descripcion: 'Creatina monohidrato pura',
    precioCompra: 8000,
    precioVenta: 12000,
    stock: 8,
    stockMinimo: 3,
    activo: true,
    categoria: 'Suplementos',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    nombre: 'Guantes de Levantamiento',
    descripcion: 'Guantes de cuero para levantamiento de pesas',
    precioCompra: 3000,
    precioVenta: 5000,
    stock: 25,
    stockMinimo: 5,
    activo: true,
    categoria: 'Accesorios',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    nombre: 'Barra Proteica',
    descripcion: 'Barra energética con proteínas',
    precioCompra: 200,
    precioVenta: 350,
    stock: 50,
    stockMinimo: 10,
    activo: true,
    categoria: 'Snacks',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockEstadoCaja = {
  abierta: true,
  montoInicial: 5000,
  totalIngresos: 12500,
  totalEgresos: 3200,
  totalCaja: 14300,
  totalEfectivo: 9800,
  totalTarjetas: 3500,
  totalTransferencias: 1000,
  fechaApertura: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
  usuarioApertura: 'Administrador',
};

const mockMovimientosCaja = [
  {
    id: 1,
    tipo: 'INGRESO',
    monto: 5000,
    descripcion: 'Cuota mensual - Juan Pérez',
    fecha: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    usuarioNombre: 'Administrador',
    metodoPago: 'EFECTIVO',
  },
  {
    id: 2,
    tipo: 'INGRESO',
    monto: 3500,
    descripcion: 'Venta de suplementos',
    fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    usuarioNombre: 'Administrador',
    metodoPago: 'TARJETA',
  },
  {
    id: 3,
    tipo: 'EGRESO',
    monto: 1200,
    descripcion: 'Compra de insumos de limpieza',
    fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    usuarioNombre: 'Administrador',
    metodoPago: 'EFECTIVO',
  },
  {
    id: 4,
    tipo: 'INGRESO',
    monto: 4000,
    descripcion: 'Cuota mensual - María García',
    fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    usuarioNombre: 'Administrador',
    metodoPago: 'TRANSFERENCIA',
  },
];

export const handlers = [
  // Auth
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { identifier, password } = await request.json() as any;

    if (identifier === 'admin' && password === 'admin') {
      return HttpResponse.json({
        accessToken: 'mock-admin-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          nombre: 'Administrador',
          email: 'admin@mcgym.com',
          rol: 'ADMIN',
        },
      });
    }

    if (identifier === '12345678' && password === 'alumno') {
      return HttpResponse.json({
        accessToken: 'mock-alumno-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 100,
          nombre: 'Juan Alumno',
          email: 'alumno@mcgym.com',
          rol: 'ALUMNO',
        },
      });
    }

    return HttpResponse.json(
      {
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciales inválidas',
      },
      { status: 401 }
    );
  }),

  http.get('/api/v1/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.includes('Bearer mock-admin-token')) {
      return HttpResponse.json({
        id: 1,
        nombre: 'Administrador',
        email: 'admin@mcgym.com',
        rol: 'ADMIN',
      });
    }

    if (authHeader?.includes('Bearer mock-alumno-token')) {
      return HttpResponse.json({
        id: 100,
        nombre: 'Juan Alumno',
        email: 'alumno@mcgym.com',
        rol: 'ALUMNO',
      });
    }

    return HttpResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }),

  // Dashboard
  http.get('/api/v1/dashboard/kpis', () => {
    const alumnosAlDia = mockAlumnos.filter(a =>
      new Date(a.fechaVencimiento) > new Date() && a.estado === 'ACTIVO'
    ).length;

    const alumnosVencidosMenos30 = mockAlumnos.filter(a => {
      const diff = new Date(a.fechaVencimiento).getTime() - new Date().getTime();
      const dias = diff / (1000 * 60 * 60 * 24);
      return dias < 0 && dias >= -30 && a.estado === 'ACTIVO';
    }).length;

    const alumnosVencidosMas30 = mockAlumnos.filter(a => {
      const diff = new Date(a.fechaVencimiento).getTime() - new Date().getTime();
      const dias = diff / (1000 * 60 * 60 * 24);
      return dias < -30 && a.estado === 'ACTIVO';
    }).length;

    return HttpResponse.json({
      alumnosAlDia,
      alumnosVencidosMenos30,
      alumnosVencidosMas30,
      ingresosMes: 125000,
      asistenciasHoy: 45,
      productosVendidos: 23,
    });
  }),

  // Alumnos
  http.get('/api/v1/alumnos', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const estado = url.searchParams.get('estado');

    let filtered = mockAlumnos;

    if (search) {
      filtered = filtered.filter(alumno =>
        alumno.nombre.toLowerCase().includes(search.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(search.toLowerCase()) ||
        alumno.dni.includes(search)
      );
    }

    if (estado && estado !== 'TODOS') {
      filtered = filtered.filter(alumno => alumno.estado === estado);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/v1/alumnos/:id', ({ params }) => {
    const { id } = params;
    const alumno = mockAlumnos.find(a => a.id === parseInt(id as string));

    if (!alumno) {
      return HttpResponse.json(null, { status: 404 });
    }

    // Agregar campos adicionales para la vista de alumno
    const alumnoConExtras = {
      ...alumno,
      estadoPago: alumno.estado === 'ACTIVO' ? 'AL_DIA' : 'PENDIENTE',
      tieneRutinaActiva: Math.random() > 0.5, // Simular si tiene rutina activa
      proximaClase: 'Cross Funcional - Hoy 18:00',
    };

    return HttpResponse.json(alumnoConExtras);
  }),

  // Acceso
  http.post('/api/v1/acceso', async ({ request }) => {
    const { dni } = await request.json() as any;
    const alumno = mockAlumnos.find(a => a.dni === dni);

    if (!alumno) {
      return HttpResponse.json(
        {
          success: false,
          codigo: 'NO_REGISTRADO',
          mensaje: 'Alumno no registrado en el sistema',
        },
        { status: 400 }
      );
    }

    if (alumno.estado !== 'ACTIVO') {
      return HttpResponse.json(
        {
          success: false,
          codigo: 'SUSPENDIDO',
          mensaje: 'El alumno se encuentra suspendido',
        },
        { status: 400 }
      );
    }

    const hoy = new Date();
    const vencimiento = new Date(alumno.fechaVencimiento);

    if (vencimiento < hoy) {
      const dias = Math.ceil((hoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24));
      return HttpResponse.json(
        {
          success: false,
          codigo: 'CUOTA_VENCIDA',
          mensaje: `Cuota vencida hace ${dias} días`,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      tipo: 'ENTRADA',
      mensaje: `Acceso autorizado. Bienvenido/a ${alumno.nombre} ${alumno.apellido}.`,
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        plan: alumno.plan,
        vencimiento: alumno.fechaVencimiento,
      },
    });
  }),

  // Pagos
  http.get('/api/v1/pagos', ({ request }) => {
    const url = new URL(request.url);
    const alumnoId = url.searchParams.get('alumnoId');

    const mockPagos = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      alumnoId: alumnoId ? parseInt(alumnoId) : (i % 5) + 1,
      alumnoNombre: `Alumno ${(i % 5) + 1}`,
      monto: [5000, 6000, 7000, 8000][i % 4],
      metodo: ['EFECTIVO', 'TARJETA', 'MERCADO_PAGO', 'TRANSFERENCIA'][i % 4],
      fecha: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 30).toISOString(),
      concepto: 'CUOTA_MENSUAL',
      usuarioId: 1,
      usuarioNombre: 'Administrador',
    }));

    const filtered = alumnoId
      ? mockPagos.filter(p => p.alumnoId === parseInt(alumnoId))
      : mockPagos;

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
    });
  }),

  http.post('/api/v1/pagos', () => {
    return HttpResponse.json({
      ok: true,
      pagoId: Math.random() * 1000,
      reciboUrl: '/recibos/mock-recibo.pdf',
    });
  }),

  // Crear alumno
  http.post('/api/v1/alumnos', async ({ request }) => {
    const alumnoData = await request.json() as any;

    const newAlumno = {
      id: mockAlumnos.length + 1,
      ...alumnoData,
      plan: ['Full Mensual', 'Semestral', 'Drop-in'][alumnoData.planId - 1],
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde ahora
      estado: 'ACTIVO',
    };

    mockAlumnos.push(newAlumno);

    return HttpResponse.json(newAlumno);
  }),

  // Clases
  http.get('/api/v1/clases', () => {
    return HttpResponse.json(mockClases);
  }),

  http.post('/api/v1/clases', async ({ request }) => {
    const claseData = await request.json() as any;
    const newClase = {
      id: mockClases.length + 1,
      ...claseData,
    };
    mockClases.push(newClase);
    return HttpResponse.json(newClase);
  }),

  http.put('/api/v1/clases/:id', async ({ request, params }) => {
    const { id } = params;
    const claseData = await request.json() as any;
    const claseIndex = mockClases.findIndex(c => c.id === parseInt(id as string));
    if (claseIndex === -1) {
      return HttpResponse.json({ message: 'Clase no encontrada' }, { status: 404 });
    }
    mockClases[claseIndex] = { ...mockClases[claseIndex], ...claseData };
    return HttpResponse.json(mockClases[claseIndex]);
  }),

  // Turnos
  http.get('/api/v1/turnos', ({ request }) => {
    const url = new URL(request.url);
    const desde = url.searchParams.get('desde');
    const hasta = url.searchParams.get('hasta');
    const claseId = url.searchParams.get('claseId');

    let filtered = mockTurnos;

    if (claseId) {
      filtered = filtered.filter(t => t.claseId === parseInt(claseId));
    }

    if (desde) {
      filtered = filtered.filter(t => new Date(t.fechaHora) >= new Date(desde));
    }

    if (hasta) {
      filtered = filtered.filter(t => new Date(t.fechaHora) <= new Date(hasta));
    }

    return HttpResponse.json(filtered);
  }),

  http.post('/api/v1/turnos', async ({ request }) => {
    const turnoData = await request.json() as any;
    const newTurno = {
      id: mockTurnos.length + 1,
      ...turnoData,
      inscritos: 0,
    };
    mockTurnos.push(newTurno);
    return HttpResponse.json(newTurno);
  }),

  http.put('/api/v1/turnos/:id', async ({ request, params }) => {
    const { id } = params;
    const turnoData = await request.json() as any;
    const turnoIndex = mockTurnos.findIndex(t => t.id === parseInt(id as string));
    if (turnoIndex === -1) {
      return HttpResponse.json({ message: 'Turno no encontrado' }, { status: 404 });
    }
    mockTurnos[turnoIndex] = { ...mockTurnos[turnoIndex], ...turnoData };
    return HttpResponse.json(mockTurnos[turnoIndex]);
  }),

  http.delete('/api/v1/turnos/:id', ({ params }) => {
    const { id } = params;
    const turnoIndex = mockTurnos.findIndex(t => t.id === parseInt(id as string));
    if (turnoIndex === -1) {
      return HttpResponse.json({ message: 'Turno no encontrado' }, { status: 404 });
    }
    mockTurnos.splice(turnoIndex, 1);
    return HttpResponse.json({ message: 'Turno eliminado' });
  }),

  // Inscripciones
  http.get('/api/v1/turnos/:turnoId/inscripciones', ({ params }) => {
    const { turnoId } = params;
    const turno = mockTurnos.find(t => t.id === parseInt(turnoId as string));
    if (!turno) {
      return HttpResponse.json({ message: 'Turno no encontrado' }, { status: 404 });
    }

    // Mock inscripciones basadas en alumnos inscritos
    const mockInscripciones = Array.from({ length: turno.inscritos }, (_, i) => ({
      id: i + 1,
      alumnoId: (i % 10) + 1,
      alumnoNombre: `Alumno ${(i % 10) + 1}`,
      claseTurnoId: turno.id,
      fechaInscripcion: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      estado: 'CONFIRMADO',
    }));

    return HttpResponse.json(mockInscripciones);
  }),

  http.post('/api/v1/turnos/:turnoId/inscribir', async ({ request, params }) => {
    const { turnoId } = params;
    const { alumnoId } = await request.json() as any;
    const turno = mockTurnos.find(t => t.id === parseInt(turnoId as string));
    if (!turno) {
      return HttpResponse.json({ message: 'Turno no encontrado' }, { status: 404 });
    }

    if (turno.inscritos >= turno.cupo) {
      return HttpResponse.json({ message: 'Turno completo' }, { status: 400 });
    }

    turno.inscritos += 1;
    const newInscripcion = {
      id: Math.random() * 1000,
      alumnoId,
      alumnoNombre: `Alumno ${alumnoId}`,
      claseTurnoId: turno.id,
      fechaInscripcion: new Date().toISOString(),
      estado: 'CONFIRMADO',
    };

    return HttpResponse.json(newInscripcion);
  }),

  http.delete('/api/v1/inscripciones/:inscripcionId', ({ params }) => {
    const { inscripcionId } = params;
    // Simular eliminación
    return HttpResponse.json({ message: 'Inscripción cancelada' });
  }),

  http.post('/api/v1/inscripciones/:inscripcionId/asistencia', async ({ request, params }) => {
    const { inscripcionId } = params;
    const { asistio } = await request.json() as any;
    // Simular registro de asistencia
    return HttpResponse.json({ message: 'Asistencia registrada' });
  }),

  // Para alumnos
  http.get('/api/v1/mis-turnos', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.includes('mock-alumno-token')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Simular turnos del alumno
    const misTurnos = mockTurnos.slice(0, 2).map(turno => ({
      ...turno,
      estadoInscripcion: 'CONFIRMADO',
    }));

    return HttpResponse.json(misTurnos);
  }),

  http.get('/api/v1/clases-disponibles', () => {
    return HttpResponse.json(mockClases.filter(c => c.activo));
  }),

  // Productos
  http.get('/api/v1/productos', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const categoria = url.searchParams.get('categoria');
    const activo = url.searchParams.get('activo');

    let filtered = mockProductos;

    if (search) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (categoria) {
      filtered = filtered.filter(producto => producto.categoria === categoria);
    }

    if (activo !== null) {
      filtered = filtered.filter(producto => producto.activo === (activo === 'true'));
    }

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
    });
  }),

  http.post('/api/v1/productos', async ({ request }) => {
    const productoData = await request.json() as any;

    const newProducto = {
      id: mockProductos.length + 1,
      ...productoData,
      stockMinimo: productoData.stockMinimo || 5,
      activo: true,
      createdAt: new Date().toISOString(),
    };

    mockProductos.push(newProducto);

    return HttpResponse.json(newProducto);
  }),

  http.post('/api/v1/productos/:productoId/venta', async ({ request, params }) => {
    const { productoId } = params;
    const ventaData = await request.json() as any;

    const producto = mockProductos.find(p => p.id === parseInt(productoId as string));
    if (!producto) {
      return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    if (producto.stock < ventaData.cantidad) {
      return HttpResponse.json({ message: 'Stock insuficiente' }, { status: 400 });
    }

    // Reducir stock
    producto.stock -= ventaData.cantidad;

    const venta = {
      id: Math.random() * 1000,
      productoId: producto.id,
      productoNombre: producto.nombre,
      alumnoId: ventaData.alumnoId,
      cantidad: ventaData.cantidad,
      precioUnitario: producto.precioVenta,
      total: producto.precioVenta * ventaData.cantidad,
      fecha: new Date().toISOString(),
      usuarioId: 1,
      usuarioNombre: 'Administrador',
    };

    return HttpResponse.json(venta);
  }),

  http.get('/api/v1/productos/categorias', () => {
    const categorias = [...new Set(mockProductos.map(p => p.categoria).filter(Boolean))];
    return HttpResponse.json(categorias);
  }),

  // Caja
  http.get('/api/v1/caja/estado', () => {
    return HttpResponse.json(mockEstadoCaja);
  }),

  http.get('/api/v1/caja/movimientos', ({ request }) => {
    const url = new URL(request.url);
    const fecha = url.searchParams.get('fecha');

    let filtered = mockMovimientosCaja;

    if (fecha) {
      filtered = filtered.filter(movimiento =>
        movimiento.fecha.startsWith(fecha)
      );
    }

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
    });
  }),

  http.post('/api/v1/caja/abrir', async ({ request }) => {
    const { montoInicial, notas } = await request.json() as any;

    mockEstadoCaja.abierta = true;
    mockEstadoCaja.montoInicial = montoInicial;
    mockEstadoCaja.fechaApertura = new Date().toISOString();
    mockEstadoCaja.totalCaja = montoInicial;
    mockEstadoCaja.totalEfectivo = montoInicial;

    // Agregar movimiento de apertura
    const movimientoApertura = {
      id: mockMovimientosCaja.length + 1,
      tipo: 'INGRESO',
      monto: montoInicial,
      descripcion: notas || 'Apertura de caja del día',
      fecha: new Date().toISOString(),
      usuarioNombre: 'Administrador',
      metodoPago: 'EFECTIVO',
    };
    mockMovimientosCaja.unshift(movimientoApertura);

    return HttpResponse.json({
      message: 'Caja abierta correctamente',
      estadoCaja: mockEstadoCaja,
    });
  }),

  http.post('/api/v1/caja/cerrar', () => {
    const reporte = {
      fechaCierre: new Date().toISOString(),
      montoInicial: mockEstadoCaja.montoInicial,
      totalIngresos: mockEstadoCaja.totalIngresos,
      totalEgresos: mockEstadoCaja.totalEgresos,
      totalCaja: mockEstadoCaja.totalCaja,
      movimientos: mockMovimientosCaja,
      reporteUrl: '/reportes/caja/mock-reporte.pdf',
    };

    // Resetear estado de caja
    mockEstadoCaja.abierta = false;
    mockEstadoCaja.montoInicial = 0;
    mockEstadoCaja.totalIngresos = 0;
    mockEstadoCaja.totalEgresos = 0;
    mockEstadoCaja.totalCaja = 0;
    mockEstadoCaja.totalEfectivo = 0;
    mockEstadoCaja.totalTarjetas = 0;
    mockEstadoCaja.totalTransferencias = 0;
    delete (mockEstadoCaja as any).fechaApertura;
    delete (mockEstadoCaja as any).usuarioApertura;

    return HttpResponse.json({
      message: 'Caja cerrada correctamente',
      reporte,
    });
  }),

  http.post('/api/v1/caja/movimientos', async ({ request }) => {
    const movimientoData = await request.json() as any;

    const newMovimiento = {
      id: mockMovimientosCaja.length + 1,
      ...movimientoData,
      fecha: new Date().toISOString(),
      usuarioNombre: 'Administrador',
    };

    mockMovimientosCaja.unshift(newMovimiento);

    // Actualizar estado de caja
    if (movimientoData.tipo === 'INGRESO') {
      mockEstadoCaja.totalIngresos += movimientoData.monto;
      mockEstadoCaja.totalCaja += movimientoData.monto;

      if (movimientoData.metodoPago === 'EFECTIVO') {
        mockEstadoCaja.totalEfectivo += movimientoData.monto;
      } else if (movimientoData.metodoPago === 'TARJETA') {
        mockEstadoCaja.totalTarjetas += movimientoData.monto;
      } else if (movimientoData.metodoPago === 'TRANSFERENCIA') {
        mockEstadoCaja.totalTransferencias += movimientoData.monto;
      }
    } else {
      mockEstadoCaja.totalEgresos += movimientoData.monto;
      mockEstadoCaja.totalCaja -= movimientoData.monto;

      if (movimientoData.metodoPago === 'EFECTIVO') {
        mockEstadoCaja.totalEfectivo -= movimientoData.monto;
      }
    }

    return HttpResponse.json(newMovimiento);
  }),
];
