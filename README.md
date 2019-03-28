# Installing 

1. Copy `.env.template` to `.env`.
2. Provide the values in `.env` from your [Nexmo dashboard](https://dashboard.nexmo.com/).
3. Save your private key and provide the filename (and path, if necessary), in `.env`.
4. Install [Ngrok](https://ngrok.com/), if necessary, follow directions to start, and paste generated URL into `.env` as `URL`.
5. Install dependencies with `npm install`.
6. Start the server with `node index.js`.
7. Navigate to your Ngrok URL in your browser.