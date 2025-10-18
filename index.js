const express = require('express');
const { createAudioStream } = require('universal-edge-tts');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(__dirname)); // Serve your HTML file from a 'public' directory

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post('/generate-speech', async (req, res) => {
    const text = req.body;

    try {
        console.log(text)
        const audioStream = await createAudioStream({
            text: text,
            voice: 'en-US-JennyNeural', // Specify a voice
        });

        // Collect all the audio data chunks
        const chunks = [];
        audioStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        audioStream.on('end', () => {
            // 2. Concatenate chunks and convert to a Base64 string
            const audioBuffer = Buffer.concat(chunks);
            const base64Audio = audioBuffer.toString('base64');

            // 3. Create the data URL
            const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;
            res.json({ dataUrl: dataUrl });

        });
    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
