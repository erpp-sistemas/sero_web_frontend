export const dateConverter = (date)=>{
    let fechaString = date;
let fecha = new Date(fechaString);

// Obtener el día de la semana
let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
let diaSemana = diasSemana[fecha.getUTCDay()];

// Obtener el día del mes
let diaMes = fecha.getUTCDate();

// Obtener el mes (tener en cuenta que los meses en JavaScript son base 0)
let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let mes = meses[fecha.getUTCMonth()];

// Obtener el año
let anno = fecha.getUTCFullYear();

// Obtener la hora, minutos y segundos
let horas = fecha.getUTCHours();
let minutos = fecha.getUTCMinutes();
let segundos = fecha.getUTCSeconds();

// Formatear la fecha en un formato legible
let fechaFormateada = diaSemana + ', ' + diaMes + ' de ' + mes + ' de ' + anno + ' ' + horas + ':' + minutos + ':' + segundos;


return fechaFormateada
}