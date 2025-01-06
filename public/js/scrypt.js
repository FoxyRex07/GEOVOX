document.getElementById('subir').addEventListener('click', function () {
  window.location.href = 'formulario'; // Cambia "pagina2.html" por la ruta deseada
});

document.getElementById('texto').addEventListener('click', function () {
  window.location.href = 'texto'; // Cambia "pagina2.html" por la ruta deseada
});
document.getElementById('audios').addEventListener('click', function () {
  window.location.href = 'audios'; // Cambia "pagina2.html" por la ruta deseada
});
document.getElementById('fotos').addEventListener('click', function () {
  window.location.href = 'imagenes'; // Cambia "pagina2.html" por la ruta deseada
});

//////////////////////////////////MAPA//////////////////////////////////////////////////

// Variable para almacenar los datos del archivo GeoJSON
let geojsonFeature;

// Crear el mapa centrado en unas coordenadas específicas
var map = L.map('mapa').setView([19.291261, -99.505652], 16);

// Diseño de mapa
L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 20,
  attribution: false,
  ext: 'png'
}).addTo(map);

function onEachFeature(feature, layer) {
  // Vincula un popup si hay propiedades de título y descripción
  if (feature.properties && feature.properties.title) {
    layer.bindPopup('<h2>' + feature.properties.title + '</h2>' + '<br>' + feature.properties.description);
  }

  // Eventos para cambiar el tamaño del marcador al pasar el mouse
  layer.on('mouseover', function () {
    const largeIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Ícono estándar de Leaflet
      iconSize: [30, 50], // Tamaño aumentado
      iconAnchor: [15, 50] // Ajusta el anclaje para el tamaño aumentado
    });
    layer.setIcon(largeIcon); // Cambia al ícono grande
  });

  layer.on('mouseout', function () {
    const normalIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Ícono estándar
      iconSize: [25, 41], // Tamaño normal
      iconAnchor: [12.5, 41] // Ajusta el anclaje para el tamaño normal
    });
    layer.setIcon(normalIcon); // Cambia al ícono normal
  });
}

// Cargar el archivo GeoJSON y renderizar los marcadores
fetch('/geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    geojsonFeature = data;

    // Añade los datos GeoJSON al mapa

    L.geoJSON(geojsonFeature, {
      pointToLayer: function (feature, latlng) {
        // Seleccionar el ícono según el tipo de marcador
        const markerIcons = {
          red: 'imagenes/red.png',
          blue: 'imagenes/blue.png',
          green: 'imagenes/blue.png',
          purple:"imagenes/purple.png",
          gray:"imagenes/gray.png",
          orange:"imagenes/orange.png",
          pink:"imagenes/pink.png",
          yellow:"imagenes/yellow.png"
        };
    
        const iconUrl = markerIcons[feature.properties.markerType] || '/images/default-marker.png';
    
        const normalIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [30, 41], // Tamaño normal del ícono
          iconAnchor: [12.5, 41],
          popupAnchor: [0, -41]
        });
    
        const largeIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [40, 57], // Tamaño grande del ícono al pasar el cursor
          iconAnchor: [17.5, 57],
          popupAnchor: [0, -57]
        });
    
        const marker = L.marker(latlng, { icon: normalIcon });
    
        // Eventos para cambiar el tamaño del ícono
        marker.on('mouseover', () => {
          marker.setIcon(largeIcon); // Cambia al ícono grande
        });
    
        marker.on('mouseout', () => {
          marker.setIcon(normalIcon); // Regresa al tamaño normal
        });
    
        return marker;
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.title) {
          layer.bindPopup(`<h2>${feature.properties.title}</h2><p>${feature.properties.description}</p>`);
        }
      }
    }).addTo(map);

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


///////////////////////////////// POPUPS utilizados///////////////////////////////////////////////////////////////////

  // Referencias a los elementos
  const showPopupButton = document.getElementById('show-popup');
  const popup = document.getElementById('popup');
  const overlay = document.getElementById('overlay');
  const closePopupButton = document.getElementById('close-popup');

  // Función para mostrar la ventana
  function showPopup() {
      popup.style.display = 'block';
      overlay.style.display = 'block';
  }

  // Función para cerrar la ventana
  function closePopup() {
      popup.style.display = 'none';
      overlay.style.display = 'none';
  }

  // Evento para abrir la ventana al hacer clic en el botón
  showPopupButton.addEventListener('click', showPopup);

  // Evento para cerrar la ventana al hacer clic en el botón de cerrar
  closePopupButton.addEventListener('click', closePopup);

  // Evento para cerrar la ventana al hacer clic en el overlay
  overlay.addEventListener('click', closePopup);

  // Mostrar automáticamente la ventana al cargar el documento
  window.addEventListener('load', showPopup);

  // Referencias a los elementos del nuevo popup
const geovoxText = document.getElementById('geovox');
const popupGeovox = document.getElementById('popup-geovox');
const overlayGeovox = document.getElementById('overlay-geovox');
const closeGeovoxButton = document.getElementById('close-geovox');

// Función para mostrar el popup de GEOVOX
function showGeovoxPopup() {
    popupGeovox.style.display = 'block';
    overlayGeovox.style.display = 'block';
}

// Función para cerrar el popup de GEOVOX
function closeGeovoxPopup() {
    popupGeovox.style.display = 'none';
    overlayGeovox.style.display = 'none';
}

// Evento para abrir el popup al hacer clic en el texto
geovoxText.addEventListener('click', showGeovoxPopup);

// Evento para cerrar el popup al hacer clic en el botón de cerrar
closeGeovoxButton.addEventListener('click', closeGeovoxPopup);

// Evento para cerrar la ventana al hacer clic en el overlay
overlayGeovox.addEventListener('click', closeGeovoxPopup);