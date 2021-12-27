const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");

// Creates URL to start Oauth flow
exports.createAuthUrl = (clientId, redirectUri, duration, scope) => {
    const state = uuidv4();
    const params = {
        // String: client Id located in app info
        client_id: clientId,
        response_type: "code",
        state: state,
        // String: Oauth Redirect Url specified on app creation
        redirect_uri: redirectUri,
        // String: Token duration property
        duration: duration,
        // String: Scope for token access eg. read, identity
        scope: scope,
    };
    // Creates a query uri
    const qs = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    // Full URL to initiate Reddits Oauth flow with appended query parameters
    return `https://ssl.reddit.com/api/v1/authorize?${qs}`;
};

// Retrieves auth token from reddit endpoint
exports.oAuthCallback = async (redirectUri, clientId, clientSecret, code) => {
    // Endpoint to obtain an auth token
    const tokenURL = "https://www.reddit.com/api/v1/access_token";
    try {
        // Create body params for the POST request
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);
        // Use fecth to obtain the token
        const response = await fetch(tokenURL, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // Auth header that includes the Client Id and Client Secret from created app
                // Base 64 encoding
                Authorization: `Basic ${Buffer.from(
                    `${clientId}:${clientSecret}`
                ).toString("base64")}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};
