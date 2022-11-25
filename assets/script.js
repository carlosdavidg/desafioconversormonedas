// 1.  Seleccion del boton y el parrafo que mostrará el resultado calculado

let botonConvertir = document.getElementById("botonConvertir");
let resultadoHtml = document.getElementById("parrafoTotalizar");



// 2. Listener del evento click en el botón

botonConvertir.addEventListener("click", function() {

    let entradaDePesos = document.getElementById("inputClp").value;
    var selectMoneda = document.getElementById("selectMonedas").value;

    if (entradaDePesos != "") {
        getTasasdecambio(entradaDePesos, selectMoneda);    
        renderizarGrafico(selectMoneda);    
    }



    else {alert("Ingrese la cantidad de pesos a convertir");}


})


// 3. Funcion asincrona que consulta a la API para la calculadora de Monedas


async function getTasasdecambio(entradaDePesos, selectMoneda) {
    const res = await fetch(`https://mindicador.cl/api/${selectMoneda}`);
    const data = await res.json();


    switch(selectMoneda){
        case "dolar":
            resultadoHtml.innerHTML = `$ ${(entradaDePesos / parseFloat(data.serie[0].valor)).toFixed(2)} ${data.nombre}`;
            break;

        case "euro":
            resultadoHtml.innerHTML = `€ ${(entradaDePesos / parseFloat(data.serie[0].valor)).toFixed(2)} ${data.nombre}`;
            break;
        case "uf":
            resultadoHtml.innerHTML = `${(entradaDePesos / parseFloat(data.serie[0].valor)).toFixed(2)} ${data.nombre}`;
            break;
    }

}

// 4. Funcion asincrona que consulta a la API para obtener los valores de las monedas en los ultimos 10 días

let myChart = null;

async function renderizarGrafico(selectMoneda) {

    const res = await fetch(`https://mindicador.cl/api/${selectMoneda}`);
    const data = await res.json();



    let dias = data.serie.map((e) => e.fecha.slice(8, 10));
    let valores = data.serie.map((e) => e.valor);


    let ChartData = {

        labels: dias.slice(0,10).reverse(),
        datasets: [{
                label: 'Precio Histórico últimos 10 días',
                data: valores.slice(0,10).reverse(), 
                fill: false,
                borderColor: '#4477dd',
                tension: 0.01    
        }]
        };

    let ctx = document.getElementById("myChart").getContext(`2d`);

    if (myChart != null) {
        myChart.destroy();
    }
    
     myChart = new Chart(ctx, {
        type: "line",
        data: ChartData})}
    