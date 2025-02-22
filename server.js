// Importar las dependencias necesarias
const express = require('express');  // Framework para crear el servidor web
const path = require('path');       // Módulo para trabajar con rutas de archivos
const fs = require('fs');           // Módulo para trabajar con el sistema de archivos
const app = express();              // Crear la aplicación Express
const port = 3000;                  // Puerto donde el servidor escuchará
const cors = require('cors');       // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const multer = require('multer');

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
          res.status(200).json({ message: 'Muchas gracias por compartir tu historia, ya esta en subida en la pagina de inicio' });
      });
  });
});

app.get('/geojson/:markerType', (req, res) => {
  const markerType = req.params.markerType; // Obtener el tipo desde la URL
  const geojsonPath = path.join(__dirname, 'data', 'map.geojson');

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error al leer el archivo GeoJSON.' });
      }

      try {
          const geojson = JSON.parse(data);

          // Filtrar solo los elementos con el markerType especificado
          const filteredFeatures = geojson.features.filter(feature => {
              return feature.properties && feature.properties.markerType === markerType;
          });

          res.json({ type: "FeatureCollection", features: filteredFeatures });
      } catch (error) {
          res.status(500).json({ message: 'Error al procesar el archivo GeoJSON.' });
      }
  });
});

////////////////////////Imagenes//////////////////////////////////////////

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: './uploads/', // Carpeta de destino
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Renombrar archivo para evitar conflictos
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo: 5 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('¡Solo se permiten imágenes (jpeg, jpg, png)!'));
  },
});

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Ruta para servir el archivo HTML de imágenes
app.get('/imagenes', (req, res) => {
  res.sendFile(path.join(__dirname, 'imagenes.html'));
});

// Endpoint para subir imágenes y actualizar el HTML
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No se subió ninguna imagen.');
    return res.status(400).json({ message: 'Por favor, sube una imagen válida.' });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const htmlPath = path.join(__dirname, 'imagenes.html');

  // Leer y actualizar el archivo HTML de imágenes
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo HTML de imágenes:', err.message);
      return res.status(500).json({ message: 'Error al leer el archivo HTML.' });
    }

    // Verificar si el contenedor de imágenes existe; si no, lo añade
    let updatedHtml = data;
    if (!data.includes('<div class="image-gallery">')) {
      updatedHtml = data.replace(
        '</body>',
        `
        <div class="image-gallery">
          <!-- Las imágenes se agregarán aquí -->
        </div>
        </body>`
      );
    }

    // Agregar la nueva imagen dentro del contenedor
    const newImageHtml = `
      <div class="image-entry">
        <img src="${imagePath}" alt="Imagen subida" style="width: 100%; max-width: 300px;" />
      </div>
    `;
    updatedHtml = updatedHtml.replace(
      '<div class="image-gallery">',
      `<div class="image-gallery">\n${newImageHtml}`
    );

    // Guardar el archivo HTML actualizado
    fs.writeFile(htmlPath, updatedHtml, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error al guardar el archivo HTML de imágenes:', writeErr.message);
        return res.status(500).json({ message: 'Error saving updated GeoJSON file' });
      }
      console.log('Imagen añadida al archivo HTML correctamente.');
      res.status(200).json({ message: 'Muchas gracias por compartir tu historia, ya esta en subida en la pagina de inicio' });
    });
  });
});

// Servir los archivos subidos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));


// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});