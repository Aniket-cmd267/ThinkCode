const Tesseract = require('tesseract.js');

Tesseract.recognize(
    'test.png', // put any image with text here
    'eng',
    {
        logger: m => console.log(m) // shows progress
    }
).then(({ data: { text } }) => {
    console.log("Extracted Text:\n", text);
}).catch(err => {
    console.error(err);
});