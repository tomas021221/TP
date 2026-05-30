function renderNuevoTurno() {
  const { paso, especialidadId, doctorId } = estado.nuevoTurno;
  let contenido = '';

  //SELECCIÓN DE ESPECIALIDAD
  if (paso === 1) {
    contenido = `
      <div class="grid-branches">
        ${estado.especialidades.map(e => `
          <div class="branch-card" style="border-left:5px solid ${e.color}; background: white; border-top: 1px solid ${COLOR_MINT.mintLight}44; border-right: 1px solid ${COLOR_MINT.mintLight}44; border-bottom: 1px solid ${COLOR_MINT.mintLight}44;" onclick="seleccionarEspecialidad(${e.id})">
            <div><div style="font-weight:700; color:${COLOR_MINT.emeraldDark}; font-size:16px;">${e.nombre}</div></div>
          </div>
        `).join('')}
      </div>
    `;
  }
  // SELECCIÓN DE PROFESIONAL
  else if (paso === 2) {
    const esp = estado.especialidades.find(e => e.id == especialidadId);
    const medicosFiltrados = estado.usuarios.filter(u => u.rol === 'DOCTOR' && u.especialidadId == especialidadId);
    const listaMedicosHTML = medicosFiltrados.map(m => `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:15px; border-left: 4px solid ${COLOR_MINT.vibrantMint}; background: white;">
        <div><strong style="color: ${COLOR_MINT.emeraldDark};">${m.nombreCompleto}</strong></div>
        <button class="btn btn-primary" style="background-color: ${COLOR_MINT.vibrantMint}; border-color: ${COLOR_MINT.vibrantMint}; font-weight:600;" onclick="seleccionarDoctor(${m.id})">Ver Calendario</button>
      </div>
    `).join('');

    contenido = `
      <div class="card" style="max-width:650px; background: white; border: 1px solid ${COLOR_MINT.mintLight};">
        <h3 style="margin-bottom:16px; color:${COLOR_MINT.emeraldDark}; font-weight:700;">Especialistas en ${esp.nombre}</h3>
        <div style="margin-top:15px;">${listaMedicosHTML || `<p style="color:${COLOR_MINT.lightGray};">No hay médicos disponibles para esta especialidad.</p>`}</div>
        <button class="btn btn-ghost" style="margin-top:15px; border:1px solid ${COLOR_MINT.mintLight}; color: ${COLOR_MINT.waterGreen};" onclick="irPasoTurno(1)">Volver</button>
      </div>
    `;
  }
  // CALENDARIO DE TURNOS
  else if (paso === 3) {
    const esp = estado.especialidades.find(e => e.id == especialidadId);
    const doc = estado.usuarios.find(u => u.id == doctorId);
    const { mesActual, anioActual } = estado.calendario;
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
    let offset = primerDia === 0 ? 6 : primerDia - 1;
    
    let celdas = '';
    for (let i = 0; i < offset; i++) celdas += `<div class="cal-day empty" style="background: #e2e8f0;"></div>`;
    
    const agendasDelDoc = estado.agendas.filter(a => a.doctorId == doctorId);

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaFmt = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const diaDeLaSemana = new Date(anioActual, mesActual, dia).getDay();
      const turnosDia = agendasDelDoc.filter(a => a.diaSemana === diaDeLaSemana);
      const turnosBtn = turnosDia.map(t => `<div class="turno-btn-mint" onclick="seleccionarTurnoCalendario('${fechaFmt}', '${t.horaInicio}')">${t.horaInicio}</div>`).join('');
      celdas += `<div class="cal-day" style="background: white; border: 1px solid #e2e8f0;"><div class="cal-num" style="color: ${COLOR_MINT.emeraldDark}; font-weight:700;">${dia}</div>${turnosBtn}</div>`;
    }

    contenido = `
      <style>
        .mint-cal-container { font-family: sans-serif; background: #fff; border: 1px solid ${COLOR_MINT.mintLight}; margin-top: 10px; border-radius: 8px; overflow: hidden; }
        .cal-header-mint { display: grid; grid-template-columns: repeat(7, 1fr); background: ${COLOR_MINT.emeraldDark}; color: white; text-align: center; font-weight: 700; font-size: 12px; }
        .cal-header-mint div { padding: 12px 0; border-right: 1px solid ${COLOR_MINT.mintLight}33; }
        .cal-grid-mint { display: grid; grid-template-columns: repeat(7, 1fr); background: #cbd5e1; gap: 1px; }
        .cal-day { min-height: 95px; padding: 6px; display: flex; flex-direction: column; gap: 5px; }
        .turno-btn-mint { background: ${COLOR_MINT.vibrantMint}; color: white; text-align: center; padding: 5px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; transition: background 0.2s; }
        .turno-btn-mint:hover { background: #20a878; }
      </style>
      <div class="card" style="max-width:800px; width: 100%; background: white; border: 1px solid ${COLOR_MINT.mintLight};">
        <h3 style="margin-bottom:3px; color: ${COLOR_MINT.emeraldDark}; font-weight:700;">Turnos Disponibles con ${doc.nombreCompleto}</h3>
        <p style="color: ${COLOR_MINT.lightGray}; font-size:13px; margin-bottom:15px; margin-top:0;">Especialidad: ${esp.nombre}</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <button class="btn btn-ghost" style="border: 1px solid ${COLOR_MINT.mintLight}; color: ${COLOR_MINT.emeraldDark};" onclick="cambiarMesTurnosPaciente(-1)">Anterior</button>
          <h4 style="margin:0; font-size:18px; color: ${COLOR_MINT.emeraldDark}; font-weight:700;">${nombresMeses[mesActual]} ${anioActual}</h4>
          <button class="btn btn-ghost" style="border: 1px solid ${COLOR_MINT.mintLight}; color: ${COLOR_MINT.emeraldDark};" onclick="cambiarMesTurnosPaciente(1)">Siguiente</button>
        </div>

        <div class="mint-cal-container">
          <div class="cal-header-mint"><div>LUN</div><div>MAR</div><div>MIE</div><div>JUE</div><div>VIE</div><div>SAB</div><div>DOM</div></div>
          <div class="cal-grid-mint">${celdas}</div>
        </div>
        <button class="btn btn-ghost" style="margin-top:20px; border:1px solid ${COLOR_MINT.mintLight}; color: ${COLOR_MINT.waterGreen};" onclick="irPasoTurno(2)">Volver a Médicos</button>
      </div>
    `; 
  }
  // CONFIRMACIÓN FINAL
  else if (paso === 4) {
    const esp = estado.especialidades.find(e => e.id == especialidadId);
    const doc = estado.usuarios.find(u => u.id == doctorId);
    contenido = `
      <div class="card" style="max-width:480px; border-left: 4px solid ${COLOR_MINT.vibrantMint}; background: white; box-shadow: 0 4px 14px rgba(0,0,0,0.05);">
        <h3 style="font-weight:700; margin-bottom:16px; color: ${COLOR_MINT.emeraldDark};">Resumen del Turno</h3>
        <p style="margin-bottom:8px; color: #333;"><strong>Especialidad:</strong> ${esp.nombre}</p>
        <p style="margin-bottom:8px; color: #333;"><strong>Profesional:</strong> ${doc.nombreCompleto}</p>
        <p style="margin-bottom:8px; color: #333;"><strong>Fecha pautada:</strong> ${estado.nuevoTurno.fecha}</p>
        <p style="margin-bottom:8px; color: #333;"><strong>Horario de cita:</strong> ${estado.nuevoTurno.hora} hs</p>
        <div style="display:flex; gap:10px; margin-top:25px">
          <button class="btn btn-ghost" style="border:1px solid ${COLOR_MINT.mintLight}; color: ${COLOR_MINT.lightGray};" onclick="irPasoTurno(3)">Atrás</button>
          <button class="btn btn-success" style="flex:1; background-color: ${COLOR_MINT.vibrantMint}; border-color: ${COLOR_MINT.vibrantMint}; font-weight:700;" onclick="confirmarTurno()">Confirmar y Solicitar</button>
        </div>
      </div>
    `;
  }

  renderizar(`<div id="app-layout">${htmlSidebar('nuevo_turno')}<div id="main-content" class="fade-in" style="background-color: ${COLOR_MINT.bgTint};"><h1 class="page-title" style="color: ${COLOR_MINT.emeraldDark};">Pedir Turno Médico</h1><div style="margin-bottom:20px; color:${COLOR_MINT.lightGray}; font-size:14px;">Progreso: Paso ${paso} de 4</div>${contenido}</div></div>`);
}

function renderHistorial() {
  const misRegistros = estado.turnos.filter(t => t.pacienteNombre === estado.usuario.nombreCompleto && t.estado === 'COMPLETADO');
  let filasHTML = '';
  
  if (misRegistros.length === 0) {
    filasHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: ${COLOR_MINT.lightGray};">No hay registros médicos aún.</td></tr>`;
  } else {
    filasHTML = misRegistros.map(t => {
      const esp = estado.especialidades.find(e => e.id == t.especialidadId);
      return `<tr><td><strong>${t.fecha}</strong></td><td>${esp ? esp.nombre : '—'}</td><td>${t.doctorNombre}</td><td>${t.diagnostico || 'Atención completada'}</td><td style="text-align:center;"><button class="btn btn-ghost" style="font-size:12px; padding:6px 10px; border: 1px solid ${COLOR_MINT.mintLight}; color:${COLOR_MINT.emeraldDark}; font-weight:600;" onclick="window.print()">Imprimir</button></td></tr>`;
    }).join('');
  }

  const estilosImpresion = `<style>@media print { #sidebar, .btn { display: none !important; } #main-content { margin: 0 !important; padding: 0 !important; width: 100% !important; background: white !important; color: black !important; } body, .card { background: white !important; color: black !important; border: none !important; box-shadow: none !important; } }</style>`;

  renderizar(`${estilosImpresion}<div id="app-layout">${htmlSidebar('historial')}<div id="main-content" class="fade-in" style="background-color: ${COLOR_MINT.bgTint};"><h1 class="page-title" style="color: ${COLOR_MINT.emeraldDark};">Mi Historial Médico</h1><div class="card" style="margin-top:20px; border-top: 4px solid ${COLOR_MINT.waterGreen}; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);"><div class="table-wrapper"><table><thead><tr style="background-color: ${COLOR_MINT.emeraldDark}; color: white;"><th>Fecha</th><th>Especialidad</th><th>Médico</th><th>Diagnóstico</th><th style="text-align:center;">Descargar</th></tr></thead><tbody>${filasHTML}</tbody></table></div></div></div></div>`);
}