const requestIp = require('request-ip');
const useragent = require('express-useragent');
const cookieOnly = require('cookie');
const { Database } = require('./db');
const { functions } = require('./BaiscModules');

const GuestVisit = {};

GuestVisit.initialize = async (req, res) => {
    const checkCookieResult = await GuestVisit.checkCookie(req);
    if (checkCookieResult.status) {
        req.session.USI = null;
        res.clearCookie('UID');
        var guestID = checkCookieResult.log;
        const sessionStatus = await GuestVisit.checkSession(req.session.GSI);
        if (sessionStatus) {
            await GuestVisit.updateVisits(req.session.GSI, req);
        } else {
            await GuestVisit.createSession(guestID, req);
        }
    } else {
        await GuestVisit.addNewGuest(req,res);
    }
}

GuestVisit.checkCookie = async (req)=>{
  const guestID = req.cookies.GID;
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Guests');
    const decGuestID = functions.decrypt(guestID);
    const result = await collection.findOne({ gID: decGuestID });
    if (result ) {
      return {status:true, log:decGuestID};
    }else{
      return {status:false, log:"No Guest Found"};
    }
  }
  await Database.disconnect();
}

GuestVisit.addNewGuest = async (req, res)=>{
    var guestID = await functions.createNewID("Guests", "G", 'gID');
    if (!guestID.status) {
      return false;
    }
    const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Guests');
      const httpReferer = req.headers['referer'] || '';
      guestID = guestID.log;
      const dateTime = Date.now();
      const date = new Date().toISOString().split('T')[0];
      const encryptedID = functions.encrypt(guestID);
      const setCookieHeader = cookieOnly.serialize('GID', encryptedID, {
        path: '/',
        httpOnly: true,
        maxAge: 3600 * 24 * 30 * 365 // Cookie will expire in 1 years
      });
      const referedByPerson = req.query.ref || '';
      res.setHeader('Set-Cookie', setCookieHeader);
      const guestData = {
        date: date,
        gID: guestID,
        rfPrsn:referedByPerson,
        httpRef: httpReferer
      };
      const result = await collection.insertOne(guestData);
      if (result.acknowledged) {
        await GuestVisit.createSession(guestID, req)
      }
    }
    await Database.disconnect();
}

GuestVisit.createSession = async (guestID, req)=>{
  var sessionID = await functions.createNewID("Sessions", "GS", 'sID');
  if (!sessionID.status) {
    return false;
  }
  sessionID = sessionID.log;
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Sessions');
    req.session.GSI = sessionID;
    const guestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const date = new Date().toISOString().split('T')[0];
    const visitedPage = req.originalUrl;
    const visitTime = Math.floor(Date.now() / 1000);
    const sessionData = {
      date: date,
      sID: sessionID,
      pID: guestID,
      ipAdd: guestIP,
      vCont: 1,
      vPge: [visitedPage],
      vTme: [visitTime]

    };
    await collection.insertOne(sessionData);
  }
  await Database.disconnect();
}

GuestVisit.updateVisits = async (sessionID, req)=> {
  const visitedPage = req.originalUrl;
  if(visitedPage.startsWith('/API/') || visitedPage == '/favicon.ico') {
    return false;
  }
  const database = await Database.connect();
  if(database.status){
    const conn = database.conn;
    const collection = conn.collection('Sessions');
    const visitTime = Math.floor(Date.now() / 1000);
    const visitedPage = req.originalUrl;
    const fetchData = await collection.findOne({sID: sessionID})
    var newVisitCount = fetchData.vCont + 1;
    await collection.updateOne(
      { sID: sessionID },
      {
          $set: { vCont: newVisitCount },
          $push: { 
            vPge: visitedPage,
            vTme: visitTime 
          }
      }
  );
  }
  await Database.disconnect();
}
  
GuestVisit.existInDB = async (gID)=> {
    const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Guests');
      const result = await collection.findOne({ gID: gID });
      return !!result; // Convert result to boolean and return
    }else{
      return false;
    }
    await Database.disconnect();
}

GuestVisit.sessionExist = async (req)=> {
  const sessionPresent = {};
  if (req.session.GSI) {
      const session = req.session.GSI;
      if (await GuestVisit.checkSession(session)) {
          sessionPresent.status = true;
          sessionPresent.log = session;
      } else {
          sessionPresent.status = false;
          sessionPresent.log = "New Session detected";
      }
  } else {
      sessionPresent.status = false;
      sessionPresent.log = "Session does not exist";
  }

  return sessionPresent;
}

GuestVisit.checkSession = async (sess) => {
  const database = await Database.connect();
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('Sessions');
      const result = await collection.findOne({ sID: sess });
      if (result) {
          return true;
      } else{
          return false;
      }
    }
    await Database.disconnect();
}
      

module.exports = {GuestVisit};