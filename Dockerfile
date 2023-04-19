# Usa una imagen base de nginx
FROM nginx:latest

# Copia los archivos HTML, CSS y JS al directorio de trabajo en la imagen Docker
COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
COPY script.js /usr/share/nginx/html

# Expone el puerto 80 para que otros puedan acceder a la aplicación a través de él
EXPOSE 80