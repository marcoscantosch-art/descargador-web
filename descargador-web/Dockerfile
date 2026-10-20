FROM node:20-slim

# Instalar Python, FFmpeg y curl en el servidor Linux
RUN apt-get update && apt-get install -y python3 ffmpeg curl python3-pip && rm -rf /var/lib/apt-get/lists/*

# Descargar e instalar la versi?n ejecutable oficial de yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
