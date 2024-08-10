const bip39 = require('bip39');
const crypto = require('crypto');
let myNewCryptoCoin = {};
myNewCryptoCoin.recoverWallet = {}

myNewCryptoCoin.createWallet = () => {
    const seedPhrase = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const hash = crypto.createHash('sha256').update(seed).digest();
    const privateKeyHex = hash.toString('hex');
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
    const privateKeyBase64 = privateKeyBuffer.toString('base64');
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKeyBuffer);
    const publicKey = ecdh.getPublicKey('hex');
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const walletAddress = crypto.createHash('ripemd160').update(publicKeyBuffer).digest('hex');
    return {seedPhrase:seedPhrase, privateKey:privateKeyBase64, walletAddress: walletAddress }
}

myNewCryptoCoin.recoverWallet.withSeedPhrase = (seedPhrase) => {
    if (!bip39.validateMnemonic(seedPhrase)) {
        return {status: false, log: "Invalid seed phrase"};
    }
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const hash = crypto.createHash('sha256').update(seed).digest();
    const privateKeyHex = hash.toString('hex');
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
    const privateKeyBase64 = privateKeyBuffer.toString('base64');
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKeyBuffer);
    const publicKey = ecdh.getPublicKey('hex');
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const walletAddress = crypto.createHash('ripemd160').update(publicKeyBuffer).digest('hex');
    return {status:true, walletAddress:walletAddress, privateKey: privateKeyBase64}
}

myNewCryptoCoin.recoverWallet.withSecretKey = (privateKeyBase64) => {
    try {
        const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');
        const ecdh = crypto.createECDH('secp256k1');
        ecdh.setPrivateKey(privateKeyBuffer);
        const publicKey = ecdh.getPublicKey('hex');
        const publicKeyBuffer = Buffer.from(publicKey, 'hex');
        const walletAddress = crypto.createHash('ripemd160').update(publicKeyBuffer).digest('hex');
        if (/^[0-9a-f]{40}$/.test(walletAddress)) {
            return { status:true, walletAddress: walletAddress, privateKey: privateKeyBase64};
        } else {
            return { status:false, log: 'Invalid secret key format.' };
        }
    } catch (error) {
        return { status:false, log: 'Invalid secret key or error recovering wallet.' };
    }
}


module.exports = {myNewCryptoCoin};
