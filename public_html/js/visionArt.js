/*Clase para usar la cámara web desde el navegador 
 ------------Clase CamaraVideo ---------------------*/
function CamaraVideo(webcam) {
    //-----------Atributos --------
    this.webcam = webcam;
    //------------Métodos-----------
    this.usarCamara = function () {
        navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, function (stream) { //Empieza la ejecución del video
                var url = (window.URL || window.webkitURL || window.mozURL || window.msURL);
                webcam.src = url ? url.createObjectURL(stream) : stream;
                webcam.play();

            }, function (e) { //Manejo de error
                alert("Error en la aplicación: " + e);
            });
        }
        return false;
    };
}

/*------------Clase Imagen ---------------------*/
/*Recibe como parámetros
 ancho: Ancho de la imagen
 alto: Alto de la imagen
 camara: Capa donde se está mostrando la Webcam.
 foto: Foto que se toma de la Webcam 
       (sobre la foto se manipulan los pixeles de la imagen)
 */
function Imagen(ancho, alto, camara, foto) {
    //-----------Atributos -------
    //Constructor de la clase
    this.ancho = ancho;
    this.alto = alto;
    this.camara = camara;
    this.foto = foto;
    this.img = null;
    /*Objeto que representa la Marca Derecha*/
    var marcaDerecha = new Marca(100, 150, 700, 0);
    /*Objeto que representa la Marca Izquierda*/
    var marcaIzquierda = new Marca(100, 150, 0, 0);
    //------------Métodos-----------
    /*Toma una foto desde la webcam*/
    this.capturar = function () {
        foto.width = this.ancho;
        foto.height = this.alto;
        /*se obtiene la imagen de la webcam en 2D*/
        this.img = this.foto.getContext('2d');
        this.img.drawImage(this.camara, 0, 0, this.ancho, this.alto);
    };
    /*Analiza la imagen para determinar si fue 'tocada'
      en la parte superior izquierda o derecha*/
    this.analizar = function () {
        //creamos un vector con los pixeles de la imagen.
        /*Parámetros:
         * x=0
         * y=0
         * ancho=ancho de la imagen desplegada por la webcam(800px)
         * alto= alto de la imagen desplegada por la webcam(600px)*/
        vImagen = this.img.getImageData(0, 0, this.ancho, this.alto);
       
        //Monitorea si la parte superior derecha
        // fue señalada con un objeto rojo
        if (marcaDerecha.verificar(vImagen))
            /*Si detecta que fue 'tocada' mueve el objeto.
             * 1: Derecha
             * 2: Izquierda*/
            return 1;
            //marcaDerecha.mover(2);
        //Monitorea si la parte superior izquierda
        // fue señalada con un objeto rojo
        if (marcaIzquierda.verificar(vImagen))
            /*Si detecta que fue 'tocada' mueve el objeto*/
            return 2;
            //marcaIzquierda.mover(1);
    };
}

/*------------Clase Marca ---------------------*/
function Marca(ancho, alto, x, y) {
    //-----------Atributos -------
    this.anchoMarca = ancho;  //ancho de la Marca
    this.altoMarca = alto;   //Alto de la Marca
    this.marcaX = x;  //Valor de la coordenada en X
    this.marcaY = y; //Valor de la coordenada en Y
    //------------Métodos-----------
    //Verificar si ha sido tocada la Marca
    this.verificar = function (vImagen) {
        /*Se calcula cual es pixel donde comienza la Marca.
         * parte superior Izquierda        
         pxIncial  -->  .......
                        .......
                        .......
         
         *se multiplica el Ancho por la coordenada en Y + coordenada en X
         *todo eso multiplicado por 4, eso no da el pixel donde inicial la Marca*/
        var pixelInicial = 4*((this.anchoMarca * this.marcaY) + this.marcaX);
        //Ancho de la Imagen en pixeles (4 puntos por cada pixel(RGBA))
        var anchoImgEnPixeles = oImagen.ancho * 4;
         //Ancho de la Marca en pixeles (4 puntos por cada pixel(RGBA))
        var anchoMarcaEnPixeles = this.anchoMarca * 4;
        var pos = pixelInicial;
        for (i = 0; i < this.altoMarca; i++) {
            for (j = 0; j < this.anchoMarca; j++) {
                promeGB = (vImagen.data[pos + 1] + vImagen.data[pos + 2]) / 2;
                if ((promeGB < 101) && (vImagen.data[pos] > 150)) {
                    return true;
                }
                pos += 4;
            }
            /*Siguiente punto a analizar:
             * A la posición actual(pos) le sumanos la diferencia 
             * del ancho de la Imagen menos ancho de la Marca*/
            pos += (anchoImgEnPixeles - anchoMarcaEnPixeles);
        }
        return false;
    };
    //Ubicar la marca en la posición especificada.
    this.ubicar = function () {
    };
    
}
/*------------Clase enemigo--------------
Obstáculos y enemigos que debe sortear el protagonista
*/
function enemigo(x, y, ancho, alto, canvas, tipo) {
    /*-----------Atributos---------*/
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.canvas = canvas;
    this.ctx = null;
    this.tipo = tipo;
    this.imgEnemigo = new Image();
    /*------------Métodos----------*/
    /*Dibujar los enemigos en el canvas*/
    /*Precaución: al dibujar los enemigos tener en cuenta que el 
     * canvas se rota horizontalmente para compensar el efecto espejo.
     * espejo(derecha es izquierda) al rotar (derecha coincide con la derecha)*/
    this.dibujar = function () {
        /*Obtenemos el contexto 
        para dibujar dentro del canvas*/
        this.ctx = this.canvas.getContext('2d');
        this.imgEnemigo.src = 'media/' + this.tipo + '.png';
        /*Se especifica la posición(x,y), ancho y alto*/
        this.ctx.drawImage(this.imgEnemigo, this.x, this.y, this.ancho, this.alto);
    };
    /*Instrucciones para mover a los enemigos*/
    this.mover = function () {
        this.y-=2;
        this.dibujar();
    };
    /*Instrucciones para destruir los enemigos cuando colisionan
    o desaparecen del área visible del juego (y<0)*/
    this.destruir = function () {
        //Borra el espacio dibujado por el enemigo en la pantalla
        this.imgEnemigo=null;
    };
}

/*------------Clase protagonista--------------
Protagonista de la historia
*/
function protagonista(x, y, ancho, alto, canvas) {
    /*-----------Atributos---------*/
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.canvas = canvas;
    this.ctx = null;
    /*------------Métodos----------*/
    this.dibujar = function () {
        /*Obtenemos el contexto 
        para dibujar dentro del canvas*/
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = '#0000FF'; /*Se rellena de color rojo*/
        /*Se especifica la posición(x,y), ancho y alto*/
        this.ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    };
    /*Verificamos si hubo colisión con algún obstáculo */
    this.colision = function (Enemigos) {
        if (parseInt(this.x) + this.ancho < parseInt(Enemigos.x))
            return false;
        if (parseInt(this.y) + this.alto < parseInt(Enemigos.y))
            return false;
        if (parseInt(this.x) > parseInt(Enemigos.x) + Enemigos.ancho)
            return false;
        if (parseInt(this.y) > parseInt(Enemigos.y) + Enemigos.alto)
            return false;
        return true;
    };
    //Mover el objeto en el sentido especificado (derecha o izquierda)
    this.mover = function (sentido) {
        switch (sentido) {
            //Mover a la Derecha
            case 1:
                /*Incremeta en 50px*/
                this.x += 5;
                /*Si los pixeles a mover exceden el ancho
                 *  permitido no realiza el movimiento */
                if (this.x<=650){
                    /*Mueve el objeto +/-50px*/
                    //Borra el espacio dibujado por el protagonista en la pantalla
                    this.ctx.clearRect(this.x, this.y, this.ancho, this.alto);
                    this.ctx.fillRect(this.x, this.y, this.ancho, this.alto);
                }else{
                    /*Sino le asigna el máximo permitido*/
                    this.x=650;
                }
                break;
                //Mover a la Izquierda 
            case 2:
                /*Decrementa 50px*/
                 this.x -= 5;
                /*Si los pixeles a mover son menores a cero
                 * no realiza el movimiento */
                if (this.x>=100){
                    /*Mueve el objeto +/-50px*/
                    //Borra el espacio dibujado por el protagonista en la pantalla
                    this.ctx.clearRect(this.x, this.y, this.ancho, this.alto);
                    this.ctx.fillRect(this.x, this.y, this.ancho, this.alto);
                }else{
                    /*Sino le asigna el mínimo permitido*/
                    this.x=100;
                }
            break;
        }
    };
}