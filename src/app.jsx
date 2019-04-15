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
            query: "",
            albumUrls: [],
            showInfo: false,
            artistName: "",
            albumName: "",
            albumYear: "",
            albumPlayLink: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showAlbumInfo = this.showAlbumInfo.bind(this);
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

    handleInputChange() {
        let searchValue = encodeURIComponent(this.search.value.trim())
        this.setState({
            query: searchValue
        })
    }

    handleSearch() {
        let albumImageArray = [];
        spotifyApi.searchAlbums(this.state.query).then(results => {
            results.albums.items.map(item => {
                let albumItem = [];
                albumItem.push(item.id);
                albumItem.push(item.images[0].url);
                albumImageArray.push(albumItem);
            })
        }).then(() => {
            this.setState({
                albumUrls: albumImageArray
            })
        }
        )
    }

    showAlbumInfo(albumId) {
        spotifyApi.getAlbum(albumId).then((response) => {
            this.setState({
                showInfo: true,
                artistName: response.artists[0].name,
                albumName: response.name,
                albumYear: response.release_date,
                albumPlayLink: response.external_urls.spotify
            })
        })
    }

    closeAlbumInfo(e) {
        console.log(e.target);
        if (e.target.className.indexOf("albumInfoModal") === -1) {
            return
        }
        this.setState({
            showInfo: false
        })
    }

    render() {

        let albumImageRender = [];
        this.state.albumUrls.map(album => {
            albumImageRender.push(<img src={album[1]} className="singleImage" key={album[0]} onClick={e => this.showAlbumInfo(album[0])} />)
        });

        return (
            <div className="App">
                <div className="header">
                    <h1>SpotCover App</h1>

                    <form>
                        <input type="text" placeholder="Write a track name" ref={input => this.search = input} onChange={this.handleInputChange} />
                        <button type="submit" onClick={this.handleSearch}>Search from Spotify</button>
                    </form>
                    <a href='http://localhost:1410'> Login to Spotify </a>
                </div>


                <div className="imageContainer">
                    {albumImageRender}
                </div>

                {this.state.showInfo &&
                    <div className="albumInfoModal" onClick={e => { this.closeAlbumInfo(e) }}>
                        <div className="albumInfoContent">
                            <h2>{`Artist: ${this.state.artistName}`}</h2>
                            <h2>{`Album: ${this.state.albumName}`}</h2>
                            <h2>{`Year: ${this.state.albumYear}`}</h2>
                            <a href={this.state.albumPlayLink} target="_blank">Play the Album on Spotify</a>
                            <span onClick={() => {
                                this.setState({
                                    showInfo: false
                                })
                            }}>Close Menu</span>
                        </div>
                    </div>

                }
            </div>
        );
    }
}

ReactDOM.render(<SpotCoverApp />, document.getElementById("root"));
