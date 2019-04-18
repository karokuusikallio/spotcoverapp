const spotifyLogin = () => {
    const stateKey = "spotify_auth_state";

    localStorage.removeItem(stateKey);

    const client_id = "7c64dfad73b545f8a9f18f29bda0e26c";
    const redirect_uri = "http://localhost:8080/";
    const scope = "user-read-private user-read-email";
    const state = generateRandomString(16);

    localStorage.setItem(stateKey, state);

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += `&client_id=${encodeURIComponent(client_id)}`;
    url += `&scope=${encodeURIComponent(scope)}`;
    url += `&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    url += `&state=${encodeURIComponent(state)}`;

    window.location = url;

    return;
};

const generateRandomString = length => {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (text.length <= length) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

export default spotifyLogin;