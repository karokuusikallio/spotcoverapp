import React from "react";
import ReactDOM from "react-dom";
import SpotifyWebApi from "spotify-web-api-js";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import { stringify } from "querystring";

const spotifyApi = new SpotifyWebApi();

class SpotCoverApp extends React.Component {
    constructor() {
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            query: "",
            searchType: ['track'],
            albumUrls: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            })
    }

    handleInputChange() {
        let searchValue = encodeURIComponent(this.search.value.trim())
        this.setState({
            query: searchValue
        })
    }

    handleSearch() {
        let albumImageArray = [];
        spotifyApi.searchTracks(this.state.query).then(results => {
            results.tracks.items.map(item => {
                albumImageArray.push(item.album.images[0].url);
            })
        }).then(() => {
            this.setState({
                albumUrls: albumImageArray
            })
        }
        )
    }

    render() {

        let albumImageRender = [];
        this.state.albumUrls.map(url => {
            albumImageRender.push(<img src={url} className="singleImage" key={url} />)
        })

        return (
            <div className="App">
                <a href='http://localhost:1410' > Login to Spotify </a>
                <br />
                <button onClick={() => {
                    this.getNowPlaying()
                }}>
                    Get Track Played Now
                </button>
                <br />
                <div>
                    Now Playing: {this.state.nowPlaying.name}
                </div>
                <div>
                    <img src={this.state.nowPlaying.albumArt} style={{ height: 539 }} />
                    <br />
                    <br />
                    <br />
                    <br />

                    <form>
                        <input type="text" placeholder="Write a track name" ref={input => this.search = input} onChange={this.handleInputChange} />
                        <button type="submit" onClick={this.handleSearch}>Search from Spotify</button>
                    </form>

                    <br />
                    <br />

                    <div className="imageContainer">
                        {albumImageRender}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<SpotCoverApp />, document.getElementById("root"));
