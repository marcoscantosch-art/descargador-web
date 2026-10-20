const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ruta para obtener la información básica del vídeo
app.get('/api/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL requerida' });

    const cmd = `yt-dlp --dump-json "${videoUrl}"`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: 'No se pudo obtener información' });
        try {
            const info = JSON.parse(stdout);
            res.json({
                title: info.title,
                thumbnail: info.thumbnail,
                duration: info.duration
            });
        } catch (e) {
            res.status(500).json({ error: 'Error analizando la respuesta' });
        }
    });
});

// Ruta para descargar/convertir el archivo
app.get('/api/download', (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL requerida');

    let formatOption = '-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"';
    let extension = 'mp4';

    if (format === 'mp3') {
        formatOption = '-x --audio-format mp3 --audio-quality 0';
        extension = 'mp3';
    }

    const fileName = `download_${Date.now()}.${extension}`;
    res.header('Content-Disposition', `attachment; filename="${fileName}"`);

    const cmd = `yt-dlp ${formatOption} -o - "${url}"`;
    const process = exec(cmd, { maxBuffer: 1024 * 1024 * 50 });
    process.stdout.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de descargas activo en http://localhost:${PORT}`);
});