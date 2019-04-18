const spotifyLogin = () => {
    const stateKey = "spotify_auth_state";

    localStorage.removeItem(stateKey);

    const client_id = "4e6071166a0c4948b69aa1366a1cc548";
    const redirect_uri = "https://spotcover.appspot.com/";
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