const axios = require('axios');
async function authGithub(req, clientID, clientSecret){
    const requestToken = req.query.code;
    const tokenResponse = await axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: `token ${accessToken}`
        }
    });

    const userResponseEmail = await axios({
        method: 'get',
        url: 'https://api.github.com/user/emails',
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    const rawData = {
        userData: userResponse.data,
        userEmails: userResponseEmail.data
    };
    const usefulData = {
        name: userResponse.data.name,
        profilePic: userResponse.data.avatar_url,
        email: userResponseEmail.data[0].email
    }

    if (req.cookies.ref && req.cookies.ref.length === 8) {
        usefulData.referer = req.cookies.ref;
    }

    return usefulData;
}

module.exports = {authGithub};

