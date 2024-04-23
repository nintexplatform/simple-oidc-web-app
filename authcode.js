const express = require('express');
const path = require('path');
const querystring = require('querystring');
const https = require('https');

/**
 * If you haven't yet, make sure you have defined a .env file in the root of this project. See
 * the README.md file for more information
 */
require('dotenv').config()

const httpsAgent = new https.Agent({rejectUnauthorized: true});
const client_id = `${process.env.CLIENT_ID}`;
const client_secret = `${process.env.CLIENT_SECRET}`;
const appPort = process.env.APP_PORT
const appUrl = process.env.APP_URL;
const authorityUrl = process.env.AUTHORITY_URL;
/**
 * Note: You may use the discovery endpoint to resolve these URLs automatically if
 * you're using an OIDC library. The discovery URL is
 * https://auth.nintexcloud.com/.well-known/openid-configuration
 */
const authUrl = `${authorityUrl}/connect/authorize`;
const tokenEndpoint = `${authorityUrl}/connect/token`;

/** This sample application uses the ExpressJS library */
const app = express();

/**
 * The base URL will serve our sample login page
 */
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

/**
 * On clicking the login button, the browser will redirect the user to this endpoint which will then
 * redirect them to auth.nintexcloud.com which will ask the user for consent on your behalf.
 *
 * Only users who belong to your tenant can log in.
 */
app.get('/authorize', (req, res) => {
    const params = {
        response_type: 'code',
        client_id: client_id,
        redirect_uri: `${appUrl}/oidccallback`,
        scope: "openid",
        state: 'random_state', // generate a random state value here
        prompt: 'login'
    };

    const authorizationUrl = authUrl + '?' + querystring.stringify(params);
    res.redirect(authorizationUrl);
});

/**
 * Once the user has given their consent, auth.nintexcloud.com will redirect to your application, as specified in
 * the redirect_uri. This handler below will  perform the code exchange to receive an access token for the
 * user.
 */
app.get('/oidccallback', async (req, res) => {
    const code = req.query.code;

    /** Verify state parameter here as necessary */
    const state = req.query.state;
    // Perform validations as necessary

    const tokenParams = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${appUrl}/oidccallback`,
        scope: "openid",
        client_id: client_id,
        client_secret: client_secret,
    };

    let response;
    try {
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify(tokenParams),
            agent: httpsAgent
        });

        const responseBody = await tokenResponse.text();

        try {
            response = JSON.parse(responseBody)
        } catch(e) {
            response = responseBody
        }

        /**
         * When successful, you should see a JSON response with the following fields:
         *  - id_token
         *  - access_token
         *  - expires_in
         *  - token_type
         *  - scope
         *
         * Ensure you cache this token and reuse it until its expiry.
         */
        res.send(response);
    } catch (error) {
        console.error(`Error exchanging code for token.`, error);
        res.status(500).send(`An error occurred. See the stacktrace for more information. Error: ${error.message}`);
    }
});



app.listen(appPort, function () {
    console.log('Simple Web Application running on port ' + appPort);
});