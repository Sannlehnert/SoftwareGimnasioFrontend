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
    if (authHeader?.includes('mock-admin-token')) {
      return HttpResponse.json({
        id: 1,
        nombre: 'Administrador',
        email: 'admin@mcgym.com',
        rol: 'ADMIN',
      });
    }

    if (authHeader?.includes('mock-alumno-token')) {
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
];
