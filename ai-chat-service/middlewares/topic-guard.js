'use strict';
const RESPUESTA_FUERA_DE_ALCANCE =
    'Entiendo que eso te interesa, pero mi especialidad es el apoyo emocional 💙 ' +
    'No estoy preparado/a para ayudarte con ese tipo de temas. ' +
    'Si quieres, podemos hablar de cómo te sientes o de algo que esté pasando en tu vida. ' +
    '¿Hay algo que te esté pesando emocionalmente?';


const normalizar = (texto) =>
    texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

const PATRONES_FUERA_DE_ALCANCE = [

    // Operaciones y conceptos matemáticos directos
    /\b(SUMA|RESTA|MULTIPLICA|DIVIDE|CALCULA|CALCULO|RESUELVE|RESUELVA|SIMPLIFICA|FACTORIZA)\b/,
    /\b(ECUACION|DERIVADA|INTEGRAL|LIMITE|PORCENTAJE|FRACCION|POLINOMIO|ALGEBRA)\b/,
    /\b(LOGARITMO|EXPONENCIAL|POTENCIA|RAIZ CUADRADA|RAIZ CUBICA|BINOMIO)\b/,
    // Trigonometría
    /\b(SENO|COSENO|TANGENTE|COTANGENTE|SECANTE|COSECANTE|TRIGONOMETRIA)\b/,
    /\b(LEY(ES)? DE(L)? (SENO|COSENO)|PITAGORAS|TEOREMA DE)\b/,
    /\b(ANGULO|HIPOTENUSA|CATETO|TRIANGULO RECTANGULO)\b/,
    // Estadística
    /\b(MEDIA|MEDIANA|MODA|VARIANZA|DESVIACION (ESTANDAR|TIPICA)|PROBABILIDAD)\b/,

    /\b(TAREA|DEBERES?|EJERCICIO|EXAMEN|PRUEBA|QUIZ|TRABAJO ESCOLAR)\b/,
    // Historia
    /\b(GUERRA DE|BATALLA DE|SIGLO [IVXLCDM]+|PRESIDENTES? DE|HISTORIA DE|REVOLUCION)\b/,
    /\b(INDEPENDENCIA DE|COLONIA|CONQUISTADORES?|MAYAS?|AZTECAS?|INCAS?)\b/,
    // Geografía
    /\b(CAPITAL DE|PAIS (MAS|QUE)|RIO (MAS LARGO|MAS GRANDE)|CONTINENTE)\b/,
    // Literatura
    /\b(SINOPSIS|RESUMEN DE (LA OBRA|EL LIBRO|LA NOVELA)|ANALISIS LITERARIO|FIGURAS? LITERARIA)\b/,
    /\b(AUTOR(A)? DE|GENERO LITERARIO|POEMA DE|OBRA DE)\b/,
    // Ciencias
    /\b(FOTOSINTESIS|CELULA|ATOMO|MOLECULA|TABLA PERIODICA|ELEMENTO QUIMICO)\b/,
    /\b(GRAVEDAD|VELOCIDAD DE LA LUZ|FUERZA DE|ENERGIA CINETICA|TERMODINAMICA)\b/,

    //Info
    /\b(PROGRAMACION|CODIGO|SCRIPT|ALGORITMO|COMPILAR|DEPURAR|DEBUG)\b/,
    /\b(JAVASCRIPT|PYTHON|JAVA|PHP|RUBY|SWIFT|KOTLIN|TYPESCRIPT|GOLANG|RUST)\b/,
    /\b(HTML|CSS|SQL|REACT|ANGULAR|VUE|NODE|DJANGO|LARAVEL|SPRING)\b/,
    /\b(BASE DE DATOS|MONGODB|MYSQL|POSTGRESQL|REDIS|FIREBASE)\b/,
    /\b(API|ENDPOINT|SERVIDOR|HOSTING|DEPLOY|DOCKER|GIT|GITHUB|GITLAB)\b/,
    /\b(FUNCION|CLASE|OBJETO|VARIABLE|ARRAY|BUCLE|LOOP|CONDICIONAL)\b.*\b(CODIGO|PROGRAMA|SCRIPT)\b/,
    /\b(INSTALAR|CONFIGURAR|FRAMEWORK|LIBRERIA|BIBLIOTECA|DEPENDENCIA)\b/,

    //Clima
    /\bQUE TIEMPO (HARA|ESTA|TENDRA)\b/,
    /\b(PRONOSTICO DEL? TIEMPO|TEMPERATURA HOY|VA A LLOVER|CLIMA (EN|DE))\b/,
    /\b(NOTICIAS? (DE|SOBRE)|ULTIMAS? NOTICIAS?|QUE PASO (EN|CON))\b/,

    /\b(RESULTADO(S?) DE|QUIEN GANO|CAMPEONATO|PARTIDO DE (FUTBOL|BALONCESTO|BEISBOL|TENIS|VOLIBOL))\b/,
    /\b(TABLA DE POSICIONES|LIGA (DE|MX|PREMIER)|MUNDIAL DE)\b/,

    //Receta
    /\b(RECETA DE|COMO SE PREPARA|COMO SE HACE|INGREDIENTES PARA|COCINAR)\b/,
    /\b(VUELOS? A|HOTEL EN|VISA PARA|REQUISITOS PARA VIAJAR|ATRACCIONES? (EN|DE))\b/,

    //Otras cosas
    /\b(DOSIS (DE|DEL?)|QUE MEDICAMENTO|ANTIBIOTICO|PRESCRIPCION MEDICA)\b/,
    /\b(CONTRATO (DE|PARA)|LEY \d+|ARTICULO \d+|AMPARO|DEMANDA (CIVIL|PENAL))\b/,
    /\b(INVERSION EN BOLSA|ACCIONES? DE|CRIPTOMONEDA|BITCOIN|PRECIO DEL DOLAR)\b/,
];


const esFueraDeAlcance = (mensaje) => {
    const textoNorm = normalizar(mensaje);
    return PATRONES_FUERA_DE_ALCANCE.some((patron) => patron.test(textoNorm));
};

export const detectarTemaFueraDeAlcance = (req, res, next) => {
    const { mensaje } = req.body;

    if (!mensaje || typeof mensaje !== 'string') {
        return next();
    }

    if (esFueraDeAlcance(mensaje)) {
        return res.status(200).json({
            success: true,
            tipo: 'FUERA_DE_ALCANCE',
            respuesta: RESPUESTA_FUERA_DE_ALCANCE
        });
    }

    next();
};