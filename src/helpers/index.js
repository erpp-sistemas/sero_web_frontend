const barajar = (array) => {
    let posicionActual = array.length;

    while (0 !== posicionActual) {
        const posicionAleatoria = Math.floor(Math.random() * posicionActual);
        posicionActual--;
        //"truco" para intercambiar los valores sin necesidad de una variable auxiliar
        [array[posicionActual], array[posicionAleatoria]] = [
            array[posicionAleatoria], array[posicionActual]];
    }
    return array;
}


const generarAleatorios = (cantidad) => {
    const caracteres = "0123456789-+%=*".split("");
    barajar(caracteres);
    return caracteres.slice(0, cantidad).join("")
}


const getFechaFormat = (e) => {
    let day = e.$D
    if (day.toString().length === 1) day = '0' + day
    let month = e.$M + 1
    if (month.toString().length === 1) month = '0' + month
    let year = e.$y
    return `${year}-${month}-${day}`
}

const formatDate =(dateString, format) =>{
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = new Date(dateString).toLocaleString('es-MX', options);
    
    switch (format) {
      case 'date':
        return formattedDate.split(',')[0]; // Get only the date part
      case 'time':
        return formattedDate.split(',')[1].trim(); // Get only the time part
      case 'full':
        return formattedDate; // Get the complete date and time
      default:
        return 'Invalid format';
    }
  }

  function formatNumberWithCommas(number) {
    // Asegurarse de que la entrada sea un número
    if (typeof number !== 'number') {
      return 'Invalid input';
    }
  
    // Convertir el número a una cadena y dividirlo en partes por el punto decimal
    const parts = number.toString().split('.');
  
    // Formatear la parte entera (antes del punto decimal) con comas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    // Unir las partes de nuevo
    return parts.join('.');
  }

const functionsCustom = {
    barajar,
    generarAleatorios,
    getFechaFormat,
    formatDate,
    formatNumberWithCommas,
}


export default functionsCustom