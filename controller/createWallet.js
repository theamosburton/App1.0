const bip39 = require('bip39');
const crypto = require('crypto');
const { Database } = require('./db');
const { time } = require('console');
const { functions } = require('./BaiscModules');
let myBatchWallet = {};
myBatchWallet.recoverLoginWallet = async (req, recoveryKey) =>{
    let returnValue;
    if (isSeedPhrase(recoveryKey)) {
        if (!bip39.validateMnemonic(recoveryKey)) {
            returnValue = {status: false, log: "Invalid seed phrase", purpose: "Recovery"};
        }else{
            const seed = bip39.mnemonicToSeedSync(recoveryKey);
            const hash = crypto.createHash('sha256').update(seed).digest();
            const privateKeyHex = hash.toString('hex');
            const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
            const privateKeyBase64 = privateKeyBuffer.toString('base64');
            const ecdh = crypto.createECDH('secp256k1');
            ecdh.setPrivateKey(privateKeyBuffer);
            const publicKey = ecdh.getPublicKey('hex');
            const publicKeyBuffer = Buffer.from(publicKey, 'hex');
            const walletAddress = crypto.createHash('ripemd160').update(publicKeyBuffer).digest('hex');
            const walletExists = await checkWalletExistsInDB(walletAddress);
            if (walletExists) {
                req.session.plkey = privateKeyBase64;
                returnValue =  {status:true, walletAddress:walletAddress, privateKey: privateKeyBase64, purpose: "Recovery"}
            }else{
                returnValue =  {status:false, purpose: "Recovery", log: "This is not a TuloByte wallet recovery phrase"}
            }
            
        }
        
    }else if(isPrivateKey(recoveryKey)){
        const privateKeyBuffer = Buffer.from(recoveryKey, 'base64');
        const ecdh = crypto.createECDH('secp256k1');

        let publicKey, publicKeyBuffer, walletAddress;

        if (privateKeyBuffer) {
            ecdh.setPrivateKey(privateKeyBuffer);
            publicKey = ecdh.getPublicKey('hex');
            publicKeyBuffer = Buffer.from(publicKey, 'hex');
            walletAddress = crypto.createHash('ripemd160').update(publicKeyBuffer).digest('hex');
            const walletExists = await checkWalletExistsInDB(walletAddress);
            if (walletExists) {
                req.session.plkey = recoveryKey;
                returnValue = {status: true, purpose: "Login", privateKey: recoveryKey,  walletAddress: walletAddress }
            } else {
                returnValue = {status: false,purpose: "Login",log: "This is not a tb-wallet private key" };
            }
        } else {
            returnValue =  { status: false, purpose: "Login",log: 'Invalid secret key or error logging into your wallet.'
            };
        }

    }else{
        returnValue =  { status:false, purpose: "Not Known", log: "Invalid recovery phrase or private key"};
    }
    return returnValue;
}

myBatchWallet.createWallet = async (req, referalCode) => {
    let returnValue = {};
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
    let createWalletDatabase = myBatchWallet.createWalletDatabase(referalCode, walletAddress);
    if (createWalletDatabase) {
        req.session.plkey = privateKeyBase64;
        returnValue = {status:true, log:"Wallet created sucessfully", seedPhrase:seedPhrase, privateKey:privateKeyBase64, walletAddress: walletAddress }
    }else{
        returnValue = {status:false, log:"Some problem at our end <br> Please try again"}
    }
    return returnValue;
}

myBatchWallet.createWalletDatabase = async (referalCode, walletAddress) => {
    let walletRegistered = false;
    const database = await Database.connect();
    let timeNow = Math.floor(Date.now() / 1000);
    if(database.status){
        const conn = database.conn;
        const collection = conn.collection('wallets');
        const walletCredentials = {
            address: walletAddress,
            referer: referalCode,
            creationTime: timeNow,
            status: 'Active',
            type : 'STD', // PLT, BOT, PRT
            amount: {TB:0, HB:0, DB:0, MB: 0,USD:0},
            transactions: {},
            assoc_wallet: {}
          };
        walletRegistered = await collection.insertOne(walletCredentials);
        if (walletRegistered.acknowledged == true) {
            walletRegistered = true;
        }
    }
    await Database.disconnect();
    return walletRegistered;
   
}

function isSeedPhrase(input){
    const words = input.trim().split(/\s+/);
    if (words.length === 12 || words.length === 18 || words.length === 24) {
        return words.every(word => /^[a-z]+$/.test(word))
    }
    return false;
}
async function checkWalletExistsInDB(walletAddress) {
    const database = await Database.connect();
    let returnValue = false;
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('wallets');
      const result = await collection.findOne({ address: walletAddress });  
      if (result != null) {
        return true;
      }
    }
    return returnValue;
}


function isPrivateKey(privateKeyBase64) {
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    const isBase64 = base64Regex.test(privateKeyBase64);
    let isValidLength = false;
    try {
        const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');
        isValidLength = privateKeyBuffer.length === 32;
    } catch (error) {
        isValidLength = false;
    }
    return isBase64 && isValidLength;
};

module.exports = {myBatchWallet};
