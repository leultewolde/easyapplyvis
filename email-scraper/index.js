require('dotenv').config();
const fs = require('fs');
const {OpenAI} = require('openai');
const {google} = require('googleapis');
const express = require('express');

const app = express();
const PORT = 3002;
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

// Load client secrets from the credentials.json file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const {client_secret, client_id, redirect_uris} = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

// Root route to display basic instructions
app.get('/', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.send(`Authorize this app by visiting this url: <a href="${authUrl}">Authorize</a>`);
});

// Route to handle the OAuth callback from Google
app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;

    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            return res.status(400).send('Error retrieving access token: ' + err.message);
        }
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        res.send('Authentication successful! You can close this window.');
    });
});

async function checkWithGPT(emailContent) {
    try {
        // Limit email content to a reasonable length to avoid exceeding token limits
        const MAX_LENGTH = 3000; // Adjust this as needed to stay within token limits
        if (emailContent.length > MAX_LENGTH) {
            emailContent = emailContent.slice(0, MAX_LENGTH) + '...'; // Truncate if too long
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // Updated model
            messages: [
                {role: 'system', content: "You are a helpful assistant that classifies emails."},
                {
                    role: 'user',
                    content: `Does this email contain a request to apply for a job? Email content: "${emailContent}" Answer with 'yes' or 'no'.`
                }
            ],
            max_tokens: 50, // Limiting tokens for the response to be safe
        });

        // Check if the response contains choices
        if (response && response.choices && response.choices[0]) {
            return response.choices[0].message.content.trim().toLowerCase();
        } else {
            console.error('No choices returned from GPT response');
            return 'error';
        }
    } catch (error) {
        if (error.response) {
            // OpenAI error with specific details
            console.error('OpenAI API error:', error.response.status, error.response.data);
        } else {
            // General error
            console.error('Error interacting with GPT:', error.message);
        }
        return 'error';
    }
}


// Route to list the last 10 Gmail messages (after authentication)
app.get('/list-emails', (req, res) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return res.status(401).send('Please authenticate first by visiting the root route.');

        oAuth2Client.setCredentials(JSON.parse(token));
        const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

        gmail.users.messages.list({userId: 'me', maxResults: 20}, (err, result) => {
            if (err) return res.status(400).send('The API returned an error: ' + err.message);
            const messages = result.data.messages;

            if (!messages || messages.length === 0) {
                return res.send('No messages found.');
            }

            // Fetch content of each message
            const messagePromises = messages.map((message) => {
                return gmail.users.messages.get({userId: 'me', id: message.id})
                    .then(async (msg) => {
                        const emailContent = extractEmailContent(msg.data);
                        const gptResult = await checkWithGPT(emailContent);
                        const isJobRequest = gptResult === 'yes' ? 'Job Application Request' : 'Not a Job Request';
                        return `<h3>${msg.data.snippet}</h3><p>GPT Classification: ${isJobRequest}</p>`;
                    })
                    .catch((err) => console.error('Error retrieving message:', err.message));
            });

            // Resolve all promises and send the results
            Promise.all(messagePromises).then((emailContents) => {
                res.send(emailContents.join('<hr>')); // Join the emails with a horizontal line
            });
        });
    });
});

function extractEmailContent(message) {
    let body = 'No Body';
    const parts = message.payload.parts;
    if (parts) {
        const part = parts.find(part => part.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
    } else if (message.payload.body && message.payload.body.data) {
        // Fallback to the body in case the email has no parts
        body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    }
    return body;
}

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
