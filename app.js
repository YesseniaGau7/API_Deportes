const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const rutaDeportes = path.join(__dirname, "deportes.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function leerDeportes() {
    const contenido = fs.readFileSync(rutaDeportes, "utf8");
    return JSON.parse(contenido);
}

function guardarDeportes(deportes) {
    fs.writeFileSync(
        rutaDeportes,
        JSON.stringify(deportes, null, 2),
        "utf8"
    );
}

// GET - obtener todos los deportes
app.get("/api/deportes", (req, res) => {
    const deportes = leerDeportes();
    res.json(deportes);
});

// GET - obtener un deporte por ID
app.get("/api/deportes/:id", (req, res) => {
    const deportes = leerDeportes();
    const id = Number(req.params.id);
    const deporte = deportes.find(d => d.id === id);

    if (!deporte) {
        return res.status(404).json({
            mensaje: "Deporte no encontrado"
        });
    }

    res.json(deporte);
});

// POST - agregar un deporte
app.post("/api/deportes", (req, res) => {
    const deportes = leerDeportes();

    const {
        nombre,
        escenario,
        dimensiones,
        numero_elementos,
        equipo,
        pais
    } = req.body;

    if (!nombre || !escenario || !dimensiones || !numero_elementos || !equipo || !pais) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    const nuevoId = deportes.length > 0
        ? Math.max(...deportes.map(d => d.id)) + 1
        : 1;

    const nuevoDeporte = {
        id: nuevoId,
        nombre,
        escenario,
        dimensiones,
        numero_elementos: Number(numero_elementos),
        equipo,
        pais
    };

    deportes.push(nuevoDeporte);
    guardarDeportes(deportes);

    res.status(201).json(nuevoDeporte);
});

// PUT - actualizar un deporte
app.put("/api/deportes/:id", (req, res) => {
    const deportes = leerDeportes();
    const id = Number(req.params.id);
    const indice = deportes.findIndex(d => d.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Deporte no encontrado"
        });
    }

    const {
        nombre,
        escenario,
        dimensiones,
        numero_elementos,
        equipo,
        pais
    } = req.body;

    if (!nombre || !escenario || !dimensiones || !numero_elementos || !equipo || !pais) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    deportes[indice] = {
        id,
        nombre,
        escenario,
        dimensiones,
        numero_elementos: Number(numero_elementos),
        equipo,
        pais
    };

    guardarDeportes(deportes);

    res.json(deportes[indice]);
});

// DELETE - eliminar un deporte
app.delete("/api/deportes/:id", (req, res) => {
    const deportes = leerDeportes();
    const id = Number(req.params.id);
    const indice = deportes.findIndex(d => d.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Deporte no encontrado"
        });
    }

    const eliminado = deportes.splice(indice, 1)[0];
    guardarDeportes(deportes);

    res.json({
        mensaje: "Deporte eliminado correctamente",
        deporte: eliminado
    });
});

app.get("/api", (req, res) => {
    res.json({
        mensaje: "API de deportes funcionando correctamente",
        endpoints: [
            "GET /api/deportes",
            "GET /api/deportes/:id",
            "POST /api/deportes",
            "PUT /api/deportes/:id",
            "DELETE /api/deportes/:id"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/deportes`);
});
