const express = require("express");
const oAuthHelpers = require("./oAuth");
const app = express();
const PORT = 3001;

// .env representation object of credentials from reddit app page
const env = {
    clientId,
    clientSecret,
    redirectUri,
};

// Visit to start oAuth flow
app.get("/", (req, res, next) => {
    const url = oAuthHelpers.createAuthUrl(
        env.clientId,
        env.redirectUri,
        "temporary",
        "identity"
    );
    res.send(`<a href="${url}">Authenticate with Reddit</a>`);
});

// Callback initiated by Reddit if initial step is successful
app.get("/reddit_callback", async (req, res, next) => {
    const authToken = await oAuthHelpers.oAuthCallback(
        env.redirectUri,
        env.clientId,
        env.clientSecret,
        req.query.code
    );
    console.log(authToken);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
