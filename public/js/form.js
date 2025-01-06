// Variables para almacenar los datos del formulario y las coordenadas
let title = "";
let description = "";
let latitude = null;
let longitude = null;

// Inicializar el mapa centrado en coordenadas globales (0, 0)
const map = L.map('map').setView([19.291261, -99.505652], 16); // El mapa empieza con un zoom de nivel 2

// Añadir la capa de mapa base (OpenStreetMap) al mapa
L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
  attribution: false // Atribución de la capa de mapa
}).addTo(map);

// Crear un marcador para el mapa
let marker;

// Evento que se activa cuando el usuario hace clic en el mapa
map.on('click', function (e) {
  latitude = e.latlng.lat; // Obtener la latitud del punto donde se hace clic
  longitude = e.latlng.lng; // Obtener la longitud del punto donde se hace clic

  // Si ya hay un marcador, eliminarlo
  if (marker) {
    map.removeLayer(marker);
  }

  // Crear un nuevo marcador en el punto donde se hizo clic y añadirlo al mapa
  marker = L.marker([latitude, longitude]).addTo(map)
    .bindPopup(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`) // Mostrar las coordenadas al hacer clic
    .openPopup(); // Abrir el popup con las coordenadas
});

// Evento para guardar los datos del formulario cuando se hace clic en el botón "Guardar Datos"
document.getElementById('save-button').addEventListener('click', () => {
  // Obtener los valores del formulario
  title = document.getElementById('title').value;
  description = document.getElementById('description').value;
  //COLOR DEL MARCADOR
  markerType = document.getElementById("marker-type").value;

  // Verificar si se ha seleccionado una ubicación en el mapa
  if (!latitude || !longitude) {
    alert("Por favor, selecciona un punto en el mapa."); // Avisar al usuario si no ha elegido una ubicación
    return;
  }



    // Obtener la opción seleccionada
  const markerType = document.querySelector('input[name="marker-type"]:checked').value;

  if (!markerType) {
    alert("Por favor, selecciona un tipo de marcador.");
    return;
  }


  
  // Crear un objeto GeoJSON con los nuevos datos
  const newEntry = {
    type: "Feature", // Tipo de objeto GeoJSON (Feature)
    properties: {
      title: title, // Título del lugar
      description: description, // Descripción del lugar
      markerType: markerType// Color del Marcador
    },
    geometry: {
      type: "Point", // Tipo de geometría (Punto)
      coordinates: [longitude, latitude] // Coordenadas del punto (longitud, latitud)
    }
  };

  // Enviar el objeto GeoJSON al servidor usando fetch
  fetch('/update-geojson', {
    method: 'POST', // Usar el método POST para enviar los datos
    headers: {
      'Content-Type': 'application/json' // Indicar que el contenido es JSON
    },
    body: JSON.stringify(newEntry) // Convertir el objeto JavaScript a una cadena JSON
  })
    .then(response => response.json()) // Parsear la respuesta JSON
    .then(data => {
      alert(data.message); // Mostrar el mensaje de éxito enviado por el servidor
      console.log("GeoJSON actualizado:", data); // Mostrar los datos en la consola para depuración
    })
    .catch(error => {
      console.error('Error:', error); // Mostrar un error en la consola si algo falla
      alert("Hubo un error al guardar los datos."); // Avisar al usuario si hay un error
    });
});

