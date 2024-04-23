# simple-web-app
Simple Web Application that performs a basic OIDC flow with Node.js and Express

## Requirements
* Node.js

## Setup

```bash
cd <root of project>
npm install
```

## Run the app

1. Setup a .env file. You can use the template below:
```env
APP_PORT=8085
APP_URL="http://localhost:8085"
AUTHORITY_URL="https://auth.nintexcloud.com"
CLIENT_ID="<your-client-id>"
CLIENT_SECRET="<your-client-secret>"
OPENID_DISCOVERY_ENDPOINT="https://auth.nintexcloud.com/.well-known/openid-configuration"
```

Modify values as necessary, especially your client ID and client secret

2. Run the app

```bash
npm start
```

3. Access the login page

```
http://localhost:8085
```

The URL and/or port may be different depending on your .env configuration.

