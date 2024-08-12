const { Database } = require("./db");
let crypto = require('node:crypto');
var functions = {};
functions.INCREMENT = 0;
functions.ivLength = 16;


functions.createNewID = async (collectionName, prefix, uniqueProp) => {
    const database = await Database.connect();
    if(database.status){
        let prop = uniqueProp;
        const conn = database.conn;
        const collection = conn.collection(collectionName);

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const newID = year + month + day;
        const formattedDate = `${year}-${month}-${day}`;
        const results = await collection.find({date: formattedDate }).toArray();
        let noOfRow;
        if (!results || results.length === 0) {
            noOfRow = 0;
        } else {
            noOfRow = results.length;
            if (functions.INCREMENT > 0) {
                noOfRow = noOfRow + functions.INCREMENT;
            }
        }
        let paddedNoOfRow;
        if(noOfRow < 10){
            paddedNoOfRow = '000000000' + noOfRow;
        }else if (noOfRow > 9) {
            paddedNoOfRow = '00000000'+noOfRow;
        }else if (noOfRow > 99) {
            paddedNoOfRow = '0000000'+noOfRow;
        }else if (noOfRow > 999) {
            paddedNoOfRow = '000000'+noOfRow;
        }else if (noOfRow > 9999) {
            paddedNoOfRow = '00000'+noOfRow;
        }else if (noOfRow > 99999) {
            paddedNoOfRow = '0000'+noOfRow;
        }else if (noOfRow > 999999) {
            paddedNoOfRow = '000'+noOfRow;
        }else if (noOfRow > 9999999) {
            paddedNoOfRow = '00'+noOfRow;
        }else if (noOfRow > 99999999) {
            paddedNoOfRow = '0'+noOfRow;
        }else if (noOfRow > 999999999) {
            paddedNoOfRow = noOfRow;
        }
        const newIDWithPadding = prefix + newID + paddedNoOfRow;
        var newQuery = {};
        newQuery[prop] = newIDWithPadding;
        const ifNewIDExists = await collection.findOne(newQuery);
        if (ifNewIDExists) {
            functions.INCREMENT = functions.INCREMENT + 1;
            return await functions.createNewID(collectionName, prefix, uniqueProp);
        }else{
            // console.log(newIDWithPadding)
            return {status:true, log:newIDWithPadding};
        }
    }else{
        return {status:false, log:database.conn};
    }
    await Database.disconnect();
}



functions.encrypt = (text) => {
    const authKey = Buffer.from(process.env.authSecret, 'hex');
    const iv = crypto.randomBytes(functions.ivLength);
    const cipher = crypto.createCipheriv('aes-256-cbc',authKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

functions.decrypt = (encryptedText) => {
    const authKey = Buffer.from(process.env.authSecret, 'hex');
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', authKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

functions.maskEmail = (email) => {
    let [local, domain] = email.split('@');
    let maskedLocal;
    if (local.length <= 2) {
      maskedLocal = local[0] + '*';
    } else if (local.length === 3) {
      maskedLocal = local[0] + '*' + local[2];
    } else {
      maskedLocal = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    }
    return `${maskedLocal}@${domain}`;
  }

functions.randomString = () => {
    const randomBytes = crypto.randomBytes(8); // 8 bytes = 64 bits
    return randomBytes.toString('base64'); // convert to Base64 string
}
module.exports = {functions}
