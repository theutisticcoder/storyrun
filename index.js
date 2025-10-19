const express = require('express');
const fs = require('fs');
const { UniversalEdgeTTS } = require('universal-edge-tts');
const app = express();
const path = require("path");
const port = 3000;
app.use(express.text());
app.use(express.static(path.join(__dirname, "public"))); // Serve your HTML file from a 'public' directory
app.post('/generate-speech', async (req, res) => {
    const text = req.body;
    console.log(text);
    try {
        const tts = new UniversalEdgeTTS(text, 'en-US-BrianNeural');
        var result = await tts.synthesize();
        // Collect all the audio data chunks
        const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
        fs.writeFile('output.mp3', audioBuffer, (err) => {
            if (err) throw err;
            console.log('File created and data written successfully!');
        });
        res.sendFile(path.join(__dirname, 'output.mp3'))

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

module.exports = app;