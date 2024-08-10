const { functions } = require('./BaiscModules');
const {Database} = require('./db');
const cookieOnly = require('cookie');
var SSOLogin = {};

SSOLogin.Login = async (req, res, userInfo) => {
    if (req.cookies && req.cookies.UID && req.cookies.UID.length != 0) {
        res.clearCookie('UID');
    }
    const userExists = await SSOLogin.checkUserExists(userInfo);
    var returnData;
    if (!userExists.conn) {
        returnData  = {status:false, log:userExists.log};
    }else if (userExists.status) {
        var userData = userExists.log;
        var makeLogin = await SSOLogin.makeLogin(res, userData);
        if (makeLogin) {
            returnData  = {status:true, log:"You are logged in successfully"};
        }
    }else{
        var createUser = await SSOLogin.createUser(userInfo);
        if (!createUser.conn) {
            returnData  = {status:false, log:createUser.log};
        }else if (!createUser.status) {
            returnData  = {status:false, log:createUser.log};
        }else{
            var makeLogin = await SSOLogin.makeLogin(res, createUser.log);
            if (makeLogin) {
                returnData  = {status:true, log:"You are logged in successfully"};
            }
        }
    }

    return returnData;

}

SSOLogin.createUser = async (userInfo) => {
    var userID = await functions.createNewID("Users", "U", 'uID');
    if (!userID.status) {
        returnData = {status:false, log:'Can\'t generate ID', conn:true};
    }
    const database = await Database.connect();
    if(database.status){
        const conn = database.conn;
        const collection = conn.collection('Users');
        const date = new Date().toISOString().split('T')[0];
        const creationTime = Math.floor(Date.now() / 1000);
        userInfo.uID = userID.log;
        userInfo.date = date;
        userInfo.time = creationTime;
        const result = await collection.insertOne(userInfo);
        if (result.acknowledged) {
            returnData = {status:true, log:userInfo, conn:true};
        }else{
            returnData = {status:false, log:'Database insertion Error', conn:true};
        }
    }else{
        returnData = {status:false, log:'Database connection Error', conn:false};
    }
    await Database.disconnect();
    return returnData;
}

SSOLogin.makeLogin = async (res, userData) => {
    var userID = userData.uID;
    var encUserID = functions.encrypt(userID);
    const setCookieHeader = cookieOnly.serialize('UID', encUserID, {
        path: '/',
        httpOnly: false,
        maxAge: 3600 * 24 * 30*90 // Cookie will expire in 90 days
      });

      res.setHeader('Set-Cookie', setCookieHeader);
      return true;
}

SSOLogin.checkUserExists = async (userInfo)=>{
    var returnData;
    if(!(userInfo.email)){
        returnData = {userExists:false, log:'Email not found', conn:true};
    }else{
        var email = userInfo.email;
        const database = await Database.connect();
        if(database.status){
            const conn = database.conn;
            const collection = conn.collection('Users');
            const result = await collection.findOne({ email: email });
            if (result) {
                returnData = {status:true, log:result, conn:true};
            } else{
                returnData = {status:false, log:'User not Exist', conn:true};
            }
        }else{
            returnData = {status:true, log:'Database connection Error', conn:false};
        }
    }
    await Database.disconnect();
    return returnData;

}

SSOLogin.authenticateLogin = async (req)  => {
    let returnData;
    if (!req.cookies.UID) {
        returnData = {status:false, log:'No login found', conn:true};
        return returnData;
    }
    var cookie = req.cookies.UID;
    cookie = functions.decrypt(cookie);
    const database = await Database.connect();
    if(database.status){
        const conn = database.conn;
        const collection = conn.collection('Users');
        const result = await collection.findOne({uID: cookie});
        if (result) {
            returnData = {status:true, log:result, conn:true};
        } else{
            returnData = {status:false, log:'User not Exist', conn:true};
        }
    }else{
        returnData = {status:true, log:'Database connection Error', conn:false};
    }
    await Database.disconnect();
    return returnData;
}

module.exports = {SSOLogin}