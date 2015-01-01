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
//Coordenada inicial de pixeles en X el objeto a mover
var pixeles = 200;
//Indica que el juego está pausado o no
var PAUSA = true;
var intervaloAtaque=0;

function activarTemporizador() {
    oImagen = new Imagen(800, 600, document.getElementById('webCam'), document.getElementById('foto'));
    temporizador = setInterval(function () {
        oImagen.capturar();
        /*Analiza la imagen para verificar si fue
         * toca la parte superior derecha o izquierda
         * devuelve el sentido (derecha o izquierda)*/
        sentido = oImagen.analizar();
        if (sentido) {
            protagonista.mover(sentido);
        }
        protagonista.dibujar();
        if (!PAUSA)
            atacar();
    }, 10);
}

function inicializar() {
    var oCamara = new CamaraVideo(document.getElementById("webCam"));
    oCamara.usarCamara();
    protagonista = new protagonista(300, 80, 60, 60, document.getElementById('foto'));
    activarTemporizador();
}

function iniciarAtaque() {
    //Si presiona la tecla play/pausar
    PAUSA = PAUSA === true ? false : true;
}

function atacar() {
    intervaloAtaque += 40;
    if (intervaloAtaque % 1000 == 0) {
        var x = Math.floor((Math.random() * 600) + 150);
        //Elegir cual tipo de enemigo mostrar en pantalla
        var tipo = Math.floor((Math.random() * 2) + 1);
        vEnemigos.push(new enemigo(x, 600, 60, 60, document.getElementById('foto'),tipo));
        vEnemigos[vEnemigos.length-1].dibujar();
    }
    
    //Se recorre el vector de enemigos
    for (i = 0; i < vEnemigos.length; i++) {
        //Mueve cada uno de los enemigos
        vEnemigos[i].mover();
        //Verifica si hubo colisión con algún enemigo
        if (protagonista.colision(vEnemigos[i]))
            console.info('Perdiste!!!...');
        //Si llega al borde de la zona de juego borra al los enemigos
        if (vEnemigos[i].y < 70) {
            //Se destruye el enemigo
            vEnemigos[i].destruir();
            //Se elimina el objeto del vector de enemigos
            vEnemigos.splice(i, 1);
        }
    }
}