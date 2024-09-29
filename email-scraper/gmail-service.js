const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load credentials from the credentials.json file
function loadCredentials() {
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));
    return credentials;
}

// Authorize with OAuth2 client
function authorize(credentials, callback) {
    console.log("Authorizing...")
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if token already exists
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

// Get a new token if token.json doesn't exist
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to', TOKEN_PATH);
            callback(oAuth2Client);
        });
    });
}

// Fetch recent emails from Gmail
function listMessages(auth, callback) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.list({ userId: 'me', maxResults: 10 }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const messages = res.data.messages || [];
        callback(messages);
    });
}

module.exports = {
    loadCredentials,
    authorize,
    listMessages,
};
