const express = require('express');
const { Communicate } = require('universal-edge-tts');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post('/generate-speech', async (req, res) => {
    const text = req.body;
    console.log(text);
    try {
        const audioStream = new Communicate({
            text: text,
            voice: 'en-US-JennyNeural', // Specify a voice
        });

        // Collect all the audio data chunks
        const buffers = [];
        for await (const chunk of audioStream.stream()) {
            if (chunk.type === 'audio' && chunk.data) {
                buffers.push(chunk.data);
            }
        }
        var blob = new Blob(buffers, {type: "audio/mp3"})
        console.log(blob)
        var url = URL.createObjectURL(blob);
        console.log(url);
        res.json({url: url})

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});
app.use(express.static(__dirname)); // Serve your HTML file from a 'public' directory

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
