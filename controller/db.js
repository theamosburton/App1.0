const { MongoClient, ServerApiVersion } = require('mongodb');

const url = process.env.dbURL;
const dbName = 'shellcoin';
const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function connect() {
    try {
        await client.connect();
        const db = client.db(dbName);
        return {status:true, conn:db};
    } catch (err) {
        return {status:false, conn:err};
    }
}

async function disconnect(){
    await client.close();
}

module.exports = { Database:{connect,
    client, disconnect}
    
};