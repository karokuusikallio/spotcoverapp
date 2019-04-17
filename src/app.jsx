import React from "react";
import ReactDOM from "react-dom";
import SpotifyWebApi from "spotify-web-api-js";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import { stringify } from "querystring";
import SpotCoverLogo from './img/spotCoverLogo.svg';

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
            albumPlayLink: "",
            imageSizing: 2,
            randomSearch: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showAlbumInfo = this.showAlbumInfo.bind(this);
        this.handleImageSizing = this.handleImageSizing.bind(this);
        this.handleRandomSearch = this.handleRandomSearch.bind(this);
    }

    componentDidMount() {
        this.handleRandomSearch();
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
        this.setState({
            query: this.search.value
        })
    }

    handleSearch(event) {
        if (event) {
            event.preventDefault();
        }

        let albumImageArray = [];

        spotifyApi.searchAlbums(this.state.query).then(results => {

            if (this.state.randomSearch && results.albums.items.length < 4) {
                this.handleRandomSearch();
                return;
            }
            else {
                results.albums.items.map(item => {

                    let albumItem = [];

                    if (item.images.length > 0) {
                        albumItem.push(item.id);
                        albumItem.push(item.images[0].url);
                        albumImageArray.push(albumItem);
                    }
                })
            }
        }).then(() => {
            this.setState({
                albumUrls: albumImageArray,
                showInfo: false
            })
        }
        ).catch(error => {
            if (error.status == "401" || error.status == "401") {
                window.location.replace("http://localhost:1410/login")

            } else {
                console.log("Http Request Error:");
                console.log(error);
            }
        })
    }

    handleRandomSearch() {
        const randomWord = require('random-words');
        const searchWord = randomWord();

        this.setState({
            query: searchWord,
            randomSearch: true
        }, () => {
            this.handleSearch();
            this.search.value = "";
        });
    }

    handleImageSizing(event) {
        this.setState({
            imageSizing: event.target.value
        })
    }

    showAlbumInfo(albumId) {
        spotifyApi.getAlbum(albumId).then((response) => {
            let albumYear = response.release_date.split("-")[0];

            let artistNames = [];
            for (let i = 0; i < response.artists.length; i++) {
                artistNames.push(response.artists[i].name);
            }

            this.setState({
                showInfo: true,
                artistName: artistNames.join(", "),
                albumName: response.name,
                albumYear: albumYear,
                albumPlayLink: response.external_urls.spotify
            })
        })
    }

    closeAlbumInfo(e) {
        if (e.target.className.indexOf("albumInfoModal") === -1) {
            return
        }
        this.setState({
            showInfo: false
        })
    }

    render() {
        let imageSizing = `PerRow${this.state.imageSizing}`;

        let albumImageRender = [];
        this.state.albumUrls.map(album => {
            albumImageRender.push(<img src={album[1]} className={`singleImage ${imageSizing}`} key={album[0]} onClick={e => this.showAlbumInfo(album[0])} />)
        });

        return (
            <div className="App">
                <div className="header">

                    <SpotCoverLogo height={90} width={180} className="spotcoverlogo" />

                    <div className="headerRight">
                        <form onSubmit={this.handleSearch} className="albumSearch">
                            <p>Discover Album Cover Art from Spotify</p>
                            <input type="text" placeholder="Search..." ref={input => this.search = input} onChange={this.handleInputChange} autoFocus />
                            <button type="submit" className="spotButton" onClick={() => {
                                this.setState({
                                    randomSearch: false
                                })
                            }}><span>Let's Go!</span></button>
                        </form>
                        <button onClick={this.handleRandomSearch} className="spotButton"><span>Random Search</span></button>
                    </div>
                </div>

                <div className="imageContainer">
                    {albumImageRender}
                </div>

                <div className="footer">
                    <div className="footerText perRowSelection">
                        <p>Images Per Row</p>
                        <select value={this.state.imageSizing} onChange={this.handleImageSizing}>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </select>
                    </div>

                    <div className="footerText">
                        <p>2019 © Karo Kuusikallio</p>
                    </div>

                </div>

                {this.state.showInfo &&
                    <div className="albumInfoModal" onClick={e => { this.closeAlbumInfo(e) }}>
                        <div className="albumInfoContent">
                            <h2>Album Info</h2>
                            <p>{`Artist: ${this.state.artistName}`}</p>
                            <p>{`Album: ${this.state.albumName}`}</p>
                            <p>{`Year: ${this.state.albumYear}`}</p>
                            <a href={this.state.albumPlayLink} target="_blank" className="playbutton">Play the Album</a>
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
