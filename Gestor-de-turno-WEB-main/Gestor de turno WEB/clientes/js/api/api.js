const estado = {
  token: null,
  usuario: null,
  especialidades: [
    { id: 1, nombre: 'Cardiología', color: '#ef4444', icono: '❤️' },
    { id: 2, nombre: 'Pediatría', color: '#3b82f6', icono: '👶' }
  ],
  turnos: [],
  usuarios: [
    { id: 1, username: 'admin', password: '1234', nombreCompleto: 'Admin Hospital', rol: 'ADMIN' },
    { id: 2, username: 'doctor', password: '1234', nombreCompleto: 'Dr. Pérez', rol: 'DOCTOR', especialidadId: 1 },
    { id: 3, username: 'paciente', password: '1234', nombreCompleto: 'Juan Paciente', rol: 'PACIENTE' }
  ],
  agendas: [],
  calendario: { mesActual: new Date().getMonth(), anioActual: new Date().getFullYear() },
  nuevoTurno: { paso: 1, especialidadId: null, doctorId: null, fecha: '', hora: '' }
};

const api = {
  login: async (username, password) => {
    // Simulamos buscar el usuario en la base de datos
    const user = estado.usuarios.find(u => u.username === username && u.password === password);
    if (user) return { success: true, token: 'token-simulado-123', usuario: user };
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },
  getEspecialidades: async () => ({ success: true, data: estado.especialidades }),
  getTurnos: async () => ({ success: true, data: estado.turnos }),
  getUsuarios: async () => ({ success: true, data: estado.usuarios })
};

// Funciones globales de ayuda para permisos y filtros
function tienePermiso(rol, seccion) {
    const PERMISOS = {
        ADMIN: ['dashboard', 'usuarios', 'todos_turnos', 'estadisticas', 'gestionar_esp', 'agenda', 'pagos', 'suspensiones'],
        DOCTOR: ['dashboard', 'mis_turnos', 'atencion', 'mi_agenda_doc'],
        PACIENTE: ['dashboard', 'mis_turnos', 'nuevo_turno', 'historial']
    };
    return PERMISOS[rol] ? PERMISOS[rol].includes(seccion) : false;
}

function filtrarTurnosPorRol(turnos, usuario) {
    if (usuario.rol === 'PACIENTE') return turnos.filter(t => t.pacienteNombre === usuario.nombreCompleto);
    if (usuario.rol === 'DOCTOR') return turnos.filter(t => t.doctorNombre === usuario.nombreCompleto);
    return turnos; // ADMIN ve todos los turnos del hospital
}