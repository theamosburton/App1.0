const { Database } = require("../controller/db");

function checkReferal(req, res){
    const referal = req.query.ref;
    if (referal == '12345678') {
        return true;
    }else{
        return false;
    }
}

module.exports = {checkReferal};