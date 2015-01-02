/*Conjunto de funciones que manipulan la captura y análisis de las imagenes */

//Temporizador que inica al cargar la pagina
var temporizador;
var temporizador2;
//vector de Enemmigos 
var vEnemigos = new Array();
//Protagonista del juego
var protagonista;
//Objeto que contiene la imagen desplegada por la webcam
var oImagen = new Imagen();

var intervaloAtaque = 0;

var canvasZonaJuego, ctxZonaJuego;
var juego;
function activarTemporizador() {
    var imagenRio = new Image();
    imagenRio.src = 'media/rio3.jpg';

    oImagen = new Imagen(800, 600, document.getElementById('webCam'), document.getElementById('foto'));
    temporizador = setInterval(function () {
        oImagen.capturar();
        juego.ctx.drawImage(imagenRio, 0, 0);
        /*Analiza la imagen para verificar si fue
         * toca la parte superior derecha o izquierda
         * devuelve el sentido (derecha o izquierda)*/
        sentido = oImagen.analizar();
        if (sentido) {
            protagonista.mover(sentido);
        }
        protagonista.dibujar();
        if (!juego.pausa)
            atacar();
    }, 10);
}

function inicializar() {
    juego = new juego(document.getElementById('zonaJuego'));
    var oCamara = new CamaraVideo(document.getElementById("webCam"));
    oCamara.usarCamara();
    protagonista = new protagonista(200, 0, 50, 50, juego.ctx);
    activarTemporizador();
}

function iniciarAtaque() {
    //Si presiona la tecla play/pausar
    juego.pausa = juego.pausa === true ? false : true;
}

function atacar() {
    intervaloAtaque += 40;
    if (intervaloAtaque % 1000 == 0) {
        var x = Math.floor((Math.random() * 600));
        //Elegir cual tipo de enemigo mostrar en pantalla
        var tipo = Math.floor((Math.random() * 3) + 1);
        vEnemigos.push(new enemigo(x, 500, 60, 60, juego.ctx, tipo));
        vEnemigos[vEnemigos.length - 1].dibujar();
    }

    //Se recorre el vector de enemigos
    for (i = 0; i < vEnemigos.length; i++) {
        //Mueve cada uno de los enemigos
        vEnemigos[i].mover();
        //Verifica si hubo colisión con algún enemigo
        if (protagonista.colision(vEnemigos[i]))
            console.info('Perdiste!!!...');
        //Si llega al borde de la zona de juego borra al los enemigos
        if (vEnemigos[i].y < 30) {
            //Se destruye el enemigo
            vEnemigos[i].destruir();
            //Se elimina el objeto del vector de enemigos
            vEnemigos.splice(i, 1);
        }
    }
}