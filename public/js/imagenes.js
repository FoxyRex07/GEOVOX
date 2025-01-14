document.getElementById('logo').addEventListener('click', function () {
    window.location.href = 'mapa'; 
  });
  
document.addEventListener('DOMContentLoaded', () => {
    // Delegación de eventos en el contenedor de la galería
    document.querySelector('.image-gallery').addEventListener('click', (e) => {
        // Verificar que el elemento clicado es una imagen
        if (e.target.tagName === 'IMG') {
            const img = e.target;

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            const largeImage = document.createElement('img');
            largeImage.src = img.src;
            largeImage.style.maxWidth = '90%';
            largeImage.style.maxHeight = '90%';
            largeImage.style.border = '5px';
            largeImage.style.borderRadius = '10px';

            // Agregar la imagen al modal
            modal.appendChild(largeImage);
            document.body.appendChild(modal);

            modal.addEventListener('click', () => {
                modal.remove();
            });
        }
    });
});


