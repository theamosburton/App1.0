
const { CaptchaGenerator } = require("captcha-canvas");
const { registerFont } = require("canvas");
registerFont("./src/fonts/dotted.otf", { family: "Dotted" });
const crypto = require("crypto");
require('dotenv').config();

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Ensure that the color is not too dark
    if (r + g + b < 128 * 3) {
        return getRandomColor();
    }

    return `rgb(${r},${g},${b})`;
}

function generateRandomColorsArray(size) {
    const colors = [];
    for (let i = 0; i < size; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

async function generateCaptcha(){
    const captcha = new CaptchaGenerator();
    const captchaText = generateRandomText();
    const randomColors = generateRandomColorsArray(captchaText.length)
    // captcha.setBackground("./src/brands/cBack.jpeg") // Use your background image path
    captcha.setDimension(50, 180)
    captcha.setCaptcha({
        skew: true,
        text: captchaText,
        size: 30,
        color: "white", // Specify a color if needed
        font: "Dotted",
        opacity: 1,
        rotate: 50,
        colors: randomColors
    })
    captcha.setDecoy({ opacity: 1, size: 20, color: "white" })
    captcha.setTrace({ color: "white", size: 1 }); // Specify trace color if needed
    const encryptedText = encryptText(captchaText);
    const imageBuffer = await captcha.generate()
    const captchaImage = imageBuffer.toString("base64");
    return {captchaImage, encryptedText}
}

function generateRandomText() {
    const length = Math.floor(Math.random() * 3) + 4; 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ%$@';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

function verifyCaptcha(text, encryptedText) {
    console.log(text)
    console.log(encryptedText)
    let decryptText = decryptCaptcha(encryptedText);
    let captchaVerified;
    if (text == decryptText) {
        captchaVerified = true;
    }else{
        captchaVerified = false;
    }
    return captchaVerified;
}

function encryptText(text){
    const algorithm = 'aes-256-cbc'; // Encryption algorithm
    const key = Buffer.from(process.env.key32, 'hex'); // Key generation (32 bytes for AES-256)
    const iv = Buffer.from(process.env.iv16, 'hex'); // Initialization vector (16 bytes)

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedData: encrypted
    };
}
function decryptCaptcha(encryptedData) {
    const algorithm = 'aes-256-cbc';
    key = process.env.key32.toString('hex')
    iv = process.env.iv16.toString('hex')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}


module.exports = {
    generateCaptcha,
    verifyCaptcha,
}
