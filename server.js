// Importar las dependencias necesarias
const express = require('express');  // Framework para crear el servidor web
const path = require('path');       // Módulo para trabajar con rutas de archivos
const fs = require('fs');           // Módulo para trabajar con el sistema de archivos
const app = express();              // Crear la aplicación Express
const port = 3000;                  // Puerto donde el servidor escuchará
const cors = require('cors');       // Middleware para habilitar CORS (Cross-Origin Resource Sharing)

// Middleware para parsear cuerpos de solicitud en formato JSON
app.use(express.json());
// Middleware para habilitar CORS
app.use(cors());

// Servir archivos estáticos (como CSS, JS e imágenes) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////////////// RUTAS DE PÁGINAS WEB //////////////////////////////

// Ruta para servir el archivo HTML principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mapa', (req, res) => {
    res.sendFile(path.join(__dirname, 'mapa.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir el archivo HTML del formulario (formulario.html)
app.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario.html'));
});

app.get('/audios', (req, res) => {
    res.sendFile(path.join(__dirname, 'audios.html'));
});

app.get('/imagenes', (req, res) => {
    res.sendFile(path.join(__dirname, 'imagenes.html'));
});

app.get('/texto', (req, res) => {
    res.sendFile(path.join(__dirname, 'texto.html'));
});

app.get('/nostalgia', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/nostalgia.html'));
});
app.get('/angustia', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/angustia.html'));
});
app.get('/amor', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/amor.html'));
});
app.get('/desamor', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/desamor.html'));
});
app.get('/tristeza', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/tristeza.html'));
});
app.get('/disgusto', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/disgusto.html'));
});
app.get('/felicidad', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/felicidad.html'));
});
app.get('/enojo', (req, res) => {
    res.sendFile(path.join(__dirname, 'etiquetas/enojo.html'));
});
/////////////////////////////////////// PROCESOS ///////////////////////////////////////////

// Endpoint para obtener el archivo GeoJSON
app.get('/geojson', (req, res) => {
    // Ruta del archivo GeoJSON
    const geojsonPath = path.join(__dirname, 'data', 'map.geojson');

    // Leer el archivo GeoJSON y enviarlo como respuesta
    fs.readFile(geojsonPath, 'utf8', (err, data) => {
        if (err) {
            // Si hay un error al leer el archivo, devolver error 500
            return res.status(500).json({ message: 'Error reading GeoJSON file' });
        }
        // Parsear el contenido del archivo como JSON y enviarlo al cliente
        res.json(JSON.parse(data));
    });
});

// Endpoint para guardar los datos GeoJSON actualizados
app.post('/update-geojson', (req, res) => {
    // Obtener los datos GeoJSON actualizados desde el cuerpo de la solicitud
    const newData = req.body;
    // Ruta del archivo GeoJSON donde se almacenarán los datos
    const geojsonPath = path.join(__dirname, 'data', 'map.geojson');
    console.log(req.body); // Imprimir los datos que llegaron en la solicitud

    // Leer el archivo GeoJSON actual
    fs.readFile(geojsonPath, 'utf8', (err, data) => {
        if (err) {
            // Si hay un error al leer el archivo, devolver error 500
            return res.status(500).json({ message: 'Error reading GeoJSON file' });
        }

        // Parsear el contenido del archivo GeoJSON
        const geojson = JSON.parse(data);

        // Agregar los nuevos datos (features) al principio del archivo GeoJSON
        geojson.features.unshift(newData);

        // Guardar los datos actualizados en el archivo GeoJSON
        fs.writeFile(geojsonPath, JSON.stringify(geojson, null, 2), 'utf8', (err) => {
            if (err) {
                // Si hay un error al guardar el archivo, devolver error 500
                return res.status(500).json({ message: 'Error saving updated GeoJSON file' });
            }
 //////////////////////////////////texto///////////////////////////////////////////////
            const htmlPath = path.join(__dirname, 'texto.html');
                    fs.readFile(htmlPath, 'utf8', (htmlErr, htmlData) => {
                        if (htmlErr) {
                            console.error('Error reading HTML file:', htmlErr);
                            return res.status(500).json({ error: 'Error reading HTML file' });
                        }

                        const newEntryHtml = `
                            <div class="entry">
                                <h2>${newData.properties.title}</h2>
                                <p>${newData.properties.description}</p>
                            </div>
                        `;

                        const updatedHtml = htmlData.replace(
                            '</div>',
                            `${newEntryHtml}\n</div>`
                        );

                        fs.writeFile(htmlPath, updatedHtml, 'utf8', (writeHtmlErr) => {
                            if (writeHtmlErr) {
                                console.error('Error writing HTML file:', writeHtmlErr);
                                return res.status(500).json({ error: 'Error writing HTML file' });
                            }

                            console.log('HTML updated successfully.');
                            res.status(200).json({ message: 'Muchas gracias por compartir tu historia, ya esta en subida en la pagina de inicio' });
                        });
                    });
        });
    });
});

app.post('/update-geojson', (req, res) => {
    const newData = req.body;
    const geojsonPath = path.join(__dirname, 'data', 'map.geojson');
  
    fs.readFile(geojsonPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading GeoJSON file' });
      }
  
      const geojson = JSON.parse(data);
      geojson.features.unshift(newData); // Agrega el nuevo marcador al principio
  
      fs.writeFile(geojsonPath, JSON.stringify(geojson, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving updated GeoJSON file' });
        }
        res.status(200).json({ message: 'GeoJSON updated successfully' });
      });
      res.redirect('/mapa');
    });
  });



// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});