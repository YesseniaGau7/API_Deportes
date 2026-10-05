const contenedor = document.querySelector("#contenedor-deportes");
const mensaje = document.querySelector("#mensaje");

function obtenerDeportes() {
    fetch("/api/deportes")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron obtener los deportes");
            }

            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos de la API:", data);
            mostrarDeportes(data);
        })
        .catch(error => {
            console.error(error);
            mensaje.textContent = "Ocurrió un error al cargar los deportes.";
        });
}

function mostrarDeportes(deportes) {
    contenedor.innerHTML = "";

    deportes.forEach(deporte => {
        const article = document.createElement("article");

        article.innerHTML = `
            <div class="encabezado">
                <h2>${deporte.nombre}</h2>
                <span>${deporte.pais}</span>
            </div>

            <div class="info">
                <p><strong>Escenario:</strong> ${deporte.escenario}</p>
                <p><strong>Dimensiones:</strong> ${deporte.dimensiones}</p>
                <p><strong>Número de elementos:</strong> ${deporte.numero_elementos}</p>

                <h3>Equipo</h3>
                <ul>
                    <li>Short: ${deporte.equipo.short ? "Sí" : "No"}</li>
                    <li>Playera: ${deporte.equipo.playera ? "Sí" : "No"}</li>
                    <li>Tacos: ${deporte.equipo.tacos ? "Sí" : "No"}</li>
                    <li>Medias: ${deporte.equipo.medias ? "Sí" : "No"}</li>
                </ul>
            </div>
        `;

        contenedor.appendChild(article);
    });
}

obtenerDeportes();
