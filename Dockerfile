FROM node:20-slim

# Instala OpenSSH para generar host keys si no existen
RUN apt-get update && apt-get install -y openssh-server && rm -rf /var/lib/apt/lists/*

# Crea directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package.json ./
RUN npm install

# Copia el resto del código
COPY ftpmult.js ./
COPY index.js ./

# Crea ruta para la clave host SSH
RUN mkdir -p /etc/ssh

# Puerto
EXPOSE 2121

# Comando para iniciar el proxy
CMD ["node", "index.js"]
