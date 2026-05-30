function renderMiAgendaDoctor() {
  const { mesActual, anioActual } = estado.calendario;
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  let offsetCeldasVacias = primerDia === 0 ? 6 : primerDia - 1; 

  let celdasHTML = '';
  for (let i = 0; i < offsetCeldasVacias; i++) celdasHTML += `<div class="cal-day empty" style="background: #e2e8f0; min-height: 90px;"></div>`;

  const misHorarios = estado.agendas.filter(a => a.doctorId == estado.usuario.id);

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const diaDeLaSemana = new Date(anioActual, mesActual, dia).getDay();
    const eventosDia = misHorarios.filter(a => a.diaSemana === diaDeLaSemana);
    
    const eventosHTML = eventosDia.map(e => `
      <div class="cal-event-doc-mint" onclick="borrarAgendaDoctor(${e.id})" title="Eliminar este horario">
        ${e.horaInicio} - ${e.horaFin}
      </div>
    `).join('');
    
    celdasHTML += `<div class="cal-day" style="background: white; border: 1px solid #e2e8f0; min-height: 90px; padding: 6px; display: flex; flex-direction: column; gap: 4px;">
      <div class="cal-num" style="color: #18564B; font-weight:700; font-size: 14px;">${dia}</div>
      ${eventosHTML}
    </div>`;
  }

  const estilosCalendario = `
<style>
      .mint-cal-wrapper-doc { font-family: 'Segoe UI', sans-serif; background: #fff; border: 1px solid ${COLOR_MINT.mintLight}; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
      .cal-header-row-doc { display: grid; grid-template-columns: repeat(7, 1fr); background: ${COLOR_MINT.emeraldDark}; color: white; text-align: center; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; }
      .cal-header-row-doc div { padding: 14px 0; border-right: 1px solid rgba(255,255,255,0.1); }
      .cal-grid-doc { display: grid; grid-template-columns: repeat(7, 1fr); background: #e2e8f0; gap: 1px; }
      .cal-day { min-height: 110px; padding: 8px; display: flex; flex-direction: column; gap: 5px; transition: background 0.2s; }
      .cal-day:hover { background: #fdfdfd !important; }
      .cal-event-doc-mint { background: ${COLOR_MINT.vibrantMint}; color: white; text-align: center; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.1s; }
      .cal-event-doc-mint:hover { background: #20a878; transform: scale(1.02); }
    </style>
  `;

  renderizar(`
    ${estilosCalendario}
    <div id="app-layout">${htmlSidebar('mi_agenda_doc')}<div id="main-content" class="fade-in" style="background-color: #F0F9F6;">
      <h1 class="page-title" style="color: #18564B;">Configurar Mis Horarios de Atención</h1>
      <div class="card" style="margin-bottom: 24px; background: white; border: 1px solid #8CD3BA; border-radius: 8px;">
        <h3 style="font-weight:700; margin-bottom: 16px; color: #18564B;">Agregar Día Recurrente</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end;">
          
          <div class="field" style="width: 180px; margin-bottom: 0;">
            <label style="color:#18564B; font-weight:600;">Día de la semana</label>
            <select id="doc-agenda-dia" class="input" style="border: 1px solid #8CD3BA;">
              <option value="">Seleccionar día...</option>
              <option value="1">Todos los Lunes</option><option value="2">Todos los Martes</option><option value="3">Todos los Miércoles</option>
              <option value="4">Todos los Jueves</option><option value="5">Todos los Viernes</option><option value="6">Todos los Sábados</option><option value="0">Todos los Domingos</option>
            </select>
          </div>

          <div class="field" style="width: 110px; margin-bottom: 0;">
            <label style="color:#18564B; font-weight:600;">Hora Entrada</label>
            <input id="doc-agenda-inicio" type="time" class="input" style="border: 1px solid #8CD3BA;" />
          </div>
          
          <div class="field" style="width: 110px; margin-bottom: 0;">
            <label style="color:#18564B; font-weight:600;">Hora Salida</label>
            <input id="doc-agenda-fin" type="time" class="input" style="border: 1px solid #8CD3BA;" />
          </div>
          
          <button class="btn btn-primary" style="height: 38px; background-color: #28C78E; border-color: #28C78E; font-weight:700;" onclick="guardarAgendaDoctor()">Establecer Horario</button>
        </div>
      </div>
      
      <div style="display:flex; align-items:center; justify-content:center; gap: 20px; margin-top: 30px;">
        <button class="btn btn-ghost" style="border: 1px solid #8CD3BA; color:#18564B;" onclick="cambiarMes(-1); renderMiAgendaDoctor();">Mes Anterior</button>
        <h2 style="font-size: 22px; font-weight: 700; width: 250px; text-align:center; color: #18564B;">${nombresMeses[mesActual]} ${anioActual}</h2>
        <button class="btn btn-ghost" style="border: 1px solid #8CD3BA; color:#18564B;" onclick="cambiarMes(1); renderMiAgendaDoctor();">Mes Siguiente</button>
      </div>
      
      <div class="mint-cal-wrapper-doc">
        <div class="cal-header-row-doc"><div>LUNES</div><div>MARTES</div><div>MIÉRCOLES</div><div>JUEVES</div><div>VIERNES</div><div>SÁBADO</div><div>DOMINGO</div></div>
        <div class="cal-grid-doc">${celdasHTML}</div>
      </div>
    </div></div>
  `);
}