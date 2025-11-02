const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const { UniversalEdgeTTS } = require('universal-edge-tts');
const app = express();
var android = require('node-on-android')
const path = require("path");
const port = 3000;
app.use(express.text());
app.use(express.static(__dirname)); // Serve your HTML file from a 'public' directory
app.post('/generate-speech', async (req, res) => {
    const text = req.body;
    console.log(text);
    try {
        const tts = new UniversalEdgeTTS(text, 'en-US-BrianNeural');
        var result = await tts.synthesize();
        var fname = crypto.pseudoRandomBytes(16).toString("hex")+'-output.mp3'
        // Collect all the audio data chunks
        const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
        fs.writeFile(fname, audioBuffer, (err) => {
            if (err) throw err;
            console.log('File created and data written successfully!');
        });
        res.send(fname.toString());

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
      android.loadUrl(`http://localhost:3000`)

});

module.exports = app;