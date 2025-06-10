const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // Cache por 5 minutos

// Middleware
app.use(cors());
app.use(express.json());

// Configuración
const PORT = 3001;
const MAIN_BACKEND_URL = 'https://rep-1-9ahu.onrender.com';
const POLLING_INTERVAL = 60000; // 1 minuto en milisegundos

// Función para hacer las peticiones y actualizar el caché
async function updateCache() {
    try {
        console.log('Actualizando caché...');
        
        // Actualizar productos
        const productsResponse = await axios.get(`${MAIN_BACKEND_URL}/api/products`);
        cache.set('/api/products', productsResponse.data);
        console.log('Caché de productos actualizado');

        // Actualizar categorías
        const categoriesResponse = await axios.get(`${MAIN_BACKEND_URL}/api/categories`);
        cache.set('/api/categories', categoriesResponse.data);
        console.log('Caché de categorías actualizado');

        // Actualizar configuración del home
        const homeResponse = await axios.get(`${MAIN_BACKEND_URL}/api/home`);
        cache.set('/api/home', homeResponse.data);
        console.log('Caché del home actualizado');

        console.log('Actualización del caché completada');
    } catch (error) {
        console.error('Error actualizando el caché:', error.message);
    }
}

// Iniciar el polling
let pollingInterval;

function startPolling() {
    // Primera actualización inmediata
    updateCache();
    
    // Configurar el intervalo
    pollingInterval = setInterval(updateCache, POLLING_INTERVAL);
    console.log(`Polling iniciado - Intervalo: ${POLLING_INTERVAL}ms`);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        console.log('Polling detenido');
    }
}

// Middleware para el caché
const cacheMiddleware = (duration) => (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log('Retornando respuesta cacheada para:', key);
        return res.json(cachedResponse);
    }

    res.originalJson = res.json;
    res.json = (body) => {
        cache.set(key, body, duration);
        res.originalJson(body);
    };
    next();
};

// Rutas para productos
app.get('/api/products', cacheMiddleware(300), async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_BACKEND_URL}/api/products`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/api/products/:id', cacheMiddleware(300), async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_BACKEND_URL}/api/products/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Rutas para categorías
app.get('/api/categories', cacheMiddleware(300), async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_BACKEND_URL}/api/categories`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// Ruta para la configuración del home
app.get('/api/home', cacheMiddleware(300), async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_BACKEND_URL}/api/home`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching home config:', error);
        res.status(500).json({ error: 'Error al obtener configuración del home' });
    }
});

// Rutas para órdenes
app.post('/api/orders', async (req, res) => {
    try {
        const response = await axios.post(`${MAIN_BACKEND_URL}/api/orders`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_BACKEND_URL}/api/orders/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
});

// Ruta para limpiar el caché manualmente
app.post('/api/cache/clear', (req, res) => {
    cache.flushAll();
    res.json({ message: 'Cache limpiado exitosamente' });
});

// Rutas para controlar el polling
app.post('/api/polling/start', (req, res) => {
    startPolling();
    res.json({ message: 'Polling iniciado' });
});

app.post('/api/polling/stop', (req, res) => {
    stopPolling();
    res.json({ message: 'Polling detenido' });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor y el polling
app.listen(PORT, () => {
    console.log(`Mini-backend corriendo en el puerto ${PORT}`);
    console.log(`Conectado a: ${MAIN_BACKEND_URL}`);
    startPolling(); // Iniciar el polling automáticamente
});

// Manejar el cierre gracioso del servidor
process.on('SIGTERM', () => {
    stopPolling();
    process.exit(0);
});

process.on('SIGINT', () => {
    stopPolling();
    process.exit(0);
}); 