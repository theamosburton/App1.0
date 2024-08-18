const { Database } = require("../controller/db");

async function checkReferal(walletAddress) {
    const database = await Database.connect();
    let returnValue = false;
    if(database.status){
      const conn = database.conn;
      const collection = conn.collection('wallets');
      const result = await collection.findOne({ address: walletAddress });
      console.log(result)
      if (result != null) {
        return true;
      }
    }
    return returnValue;
}

module.exports = {checkReferal};