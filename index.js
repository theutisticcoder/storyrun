const express = require('express');
const fs = require('fs');
const { UniversalEdgeTTS } = require('universal-edge-tts');
const app = express();
const port = 3000;
app.use(express.text());
app.use(express.static(__dirname)); // Serve your HTML file from a 'public' directory
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
        const tts = new UniversalEdgeTTS(text, 'en-US-AndrewNeural');
        var result = await tts.synthesize();
        // Collect all the audio data chunks
       const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
       fs.writeFile('output.mp3', audioBuffer);
        res.sendFile('output.mp3')

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
