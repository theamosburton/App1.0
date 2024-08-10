const { GuestVisit } = require('./GVisit');
const { UserVisit } = require('./UVisit');


const Visit = {
  async initialize(req, res) {
    if (req.cookies.UID && req.cookies.UID.length != 0) {
      await UserVisit.initialize(req, res);
    }else if(req.cookies.GID && req.cookies.GID.length != 0){
      await GuestVisit.initialize(req, res);
    }else{
      await GuestVisit.addNewGuest(req, res);
    }
  }
};
  
module.exports = {Visit}
