//Modules
const express = require('express'),
    bunyan = require('bunyan'),
    bodyParser = require('body-parser'),
    fetch = require("node-fetch"),
    querystring = require('querystring');

//Load values from .env file
require('dotenv').config();

const app = express();
const log = bunyan.createLogger({ name: 'Authorization Code Flow' });

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

//Set 1: Ask the authorization code
app.get('/get/the/code', (req, res) => {

    const Authorization_Endpoint = `http://localhost:8080/web/authorize`;
    const Response_Type = 'code';
    const Client_Id = process.env.CLIENT_ID;
    const Redirect_Uri = 'http://localhost:8000/give/me/the/code';
    const Scope = 'read';
    const State = 'ThisIsMyStateValue';

    let url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${Client_Id}&redirect_uri=${Redirect_Uri}&scope=${Scope}&state=${State}`;

    log.info(url);

    res.redirect(url);

});

//Step 2: Get the code from the URL
app.get('/give/me/the/code', (req, res) => {
    //before continue, you should check that req.query.state is the same that the state you sent
    res.render('exchange-code', { code: req.query.code, state: req.query.state });
});

//Step 3: Exchange the code for a token
app.post('/exchange/the/code/for/a/token', (req, res) => {
    const Token_Endpoint = `http://localhost:8080/v1/oauth/tokens`;
    const Grant_Type = 'authorization_code';
    const Code = req.body.code;
    const Redirect_Uri = 'http://localhost:8000/give/me/the/code';
    const Scope = 'read';

    let body = `grant_type=${Grant_Type}&code=${Code}&redirect_uri=${encodeURIComponent(Redirect_Uri)}&scope=${encodeURIComponent(Scope)}`;

    log.info(`Body: ${body}`);

    fetch(Token_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer(querystring.escape(process.env.CLIENT_ID) + ':' + querystring.escape(process.env.CLIENT_SECRET)).toString('base64')
        }
    }).then(async response => {

        let json = await response.json();
        res.render('access-token', { token: JSON.stringify(json, undefined, 2) }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });
});

//Step 4: Call the protected API
app.post('/call/protected/api', (req, res) => {

    let access_token = JSON.parse(req.body.token).access_token;

    const API_Host = 'http://localhost:9002';
    const API_Path = '/favorites';

    //Call API with your access token
    fetch(`${API_Host}${API_Path}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(async response => {

        let json = await response.json();
        res.render('calling-protected-api', { response: JSON.stringify(json, undefined, 2) });
    });
});

app.listen(8000);
