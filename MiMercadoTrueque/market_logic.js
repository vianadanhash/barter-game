// --- LISTA DE ÍTEMS DEL JUEGO ---
const todosLosItems = [
    'pollo', 'botella_roja', 'yunque', 'libro_azul', 'espejo', 
    'plata', 'oro', 'agua', 'silla', 'libro_rojo', 'taza_de_cafe', 
    'bote', 'cama', 'puerta', 'antorcha', 'lampara', 'madera', 'botella_azul'
];

// --- VARIABLES DEL JUGADOR ---
let inventario = {};
let objetivos = [];

// Inicializar el inventario en 0
todosLosItems.forEach(item => inventario[item] = 0);

// --- 1. MISIÓN INICIAL AL ENTRAR ---
WA.onInit().then(() => {
    // Para simplificar esta primera versión, el sistema asignará 3 objetivos aleatorios.
    // (Para un menú visual donde el jugador haga clic, se requiere una pequeña página HTML extra)
    let itemsAleatorios = todosLosItems.sort(() => 0.5 - Math.random()).slice(0, 3);
    objetivos = itemsAleatorios;
    
    WA.chat.sendChatMessage(`¡Bienvenido al Mercado! Tu misión es conseguir estos 3 objetos: ${objetivos.join(', ')}.`, 'Guía del Mercado');
});

// --- 2. LÓGICA DE RECOLECCIÓN (Caminar sobre los objetos) ---
todosLosItems.forEach(item => {
    // Cuando el jugador pisa el rectángulo con el nombre del ítem:
    WA.room.onEnterLayer(item).subscribe(() => {
        inventario[item] += 1;
        WA.chat.sendChatMessage(`🎒 Has recogido: ${item}. Tienes ${inventario[item]} en total.`, 'Inventario');
        
        // Comprobar si cumplió el objetivo
        verificarVictoria();
    });
});

function verificarVictoria() {
    let completado = objetivos.every(obj => inventario[obj] > 0);
    if (completado) {
        WA.chat.sendChatMessage(`🏆 ¡FELICIDADES! Has conseguido tus 3 objetivos: ${objetivos.join(', ')}. ¡Eres un maestro del trueque!`, 'Sistema');
    }
}

// --- 3. LÓGICA DE LAS 10 ZONAS DE TRUEQUE ---
for (let i = 1; i <= 10; i++) {
    let nombreZona = `zona_trueque${i}`;
    
    WA.room.onEnterLayer(nombreZona).subscribe(() => {
        // Muestra un mensaje en pantalla para interactuar
        WA.ui.displayActionMessage({
            message: `Presiona ESPACIO para negociar en la Mesa ${i}`,
            callback: () => {
                WA.chat.sendChatMessage(`Has abierto la Mesa de Trueque ${i}. (Aquí se abriría el menú de intercambio)`, 'Mesa ' + i);
                // Nota: Aquí en el futuro puedes conectar tu página web de trueque usando:
                // WA.nav.openCoWebSite('https://tu-pagina-de-trueque.com');
            }
        });
    });

    WA.room.onLeaveLayer(nombreZona).subscribe(() => {
        // Se limpia el mensaje al salir de la alfombra
        console.log(`Saliste de la Mesa ${i}`);
    });
}

// --- 4. PANTALLA DE REGISTRO PÚBLICO ---
WA.room.onEnterLayer('registro_publico').subscribe(() => {
    WA.ui.displayActionMessage({
        message: "Presiona ESPACIO para ver los intercambios",
        callback: () => {
            WA.chat.sendChatMessage("Abriendo el Registro Público de Trueques...", "Sistema");
        }
    });
});
