import React from "react";
import ReactDOM from "react-dom";
import SpotifyWebApi from "spotify-web-api-js";
import InfiniteScroll from 'react-infinite-scroll-component';
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import SpotCoverLogo from './img/spotCoverLogo.svg';
import SpotCoverLogoMobile from './img/spotCoverLogoMobile.svg';
import spotifyLogin from './components/spotifyLogin.js';
import AlbumModal from './components/AlbumModal.jsx';
import Footer from './components/Footer.jsx';
import Images from './components/Images.jsx';

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
            randomSearch: false,
            offset: 0,
            loadfromScroll: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.showAlbumInfo = this.showAlbumInfo.bind(this);
        this.handleImageSizing = this.handleImageSizing.bind(this);
        this.handleRandomSearch = this.handleRandomSearch.bind(this);
        this.closeAlbumInfo = this.closeAlbumInfo.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        document.body.classList.add("recordStore");

        if (!this.state.loggedIn) {
            spotifyLogin();
        }
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

        const backgroundImage = document.getElementsByClassName("recordStore");
        if (backgroundImage[0]) {
            document.body.classList.remove("recordStore");
        }

        let albumImageArray = [];

        spotifyApi.searchAlbums(this.state.query, { limit: 40, offset: this.state.offset }).then(results => {

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
            const concatAlbumImageArray = this.state.albumUrls.concat(albumImageArray);

            this.setState({
                albumUrls: this.state.loadfromScroll ? concatAlbumImageArray : albumImageArray,
            })
        }
        ).catch(error => {
            if (error.status == "401" || error.status == "403") {
                spotifyLogin();
            } else {
                console.log("Http Request Error:");
                console.log(error);
            }
        })
    }

    loadMore() {
        this.setState((prevState) => ({
            offset: prevState.offset + 40,
            loadfromScroll: true
        }), () => {
            this.handleSearch();
        }
        )
    }

    handleRandomSearch() {
        const randomWord = require('random-words');
        const searchWord = randomWord();

        this.setState({
            query: searchWord,
            randomSearch: true,
            loadfromScroll: false,
            offset: 0,
            showInfo: false
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
        return (
            <div className="App">
                <div className="header">

                    <SpotCoverLogo height={90} width={180} className="spotcoverlogo" />
                    <SpotCoverLogoMobile height={50} className="spotcoverlogomobile" />

                    <div className="headerRight">
                        <form onSubmit={this.handleSearch} className="albumSearch">
                            <p className="discoverText">Discover Album Cover Art from Spotify</p>
                            <input type="text" placeholder="Search..." ref={input => this.search = input} onChange={this.handleInputChange} autoFocus />
                            <button type="submit" className="spotButton" onClick={() => {
                                this.setState({
                                    randomSearch: false,
                                    loadfromScroll: false,
                                    showInfo: false,
                                    offset: 0
                                })
                            }}><span>Let's Go!</span></button>
                        </form>
                        <button onClick={this.handleRandomSearch} className="spotButton"><span>Random Search</span></button>
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={this.state.albumUrls.length}
                    next={this.loadMore}
                    hasMore={true}
                >
                    <Images sizing={this.state.imageSizing} albumUrls={this.state.albumUrls} showAlbumInfo={this.showAlbumInfo} />
                </InfiniteScroll >

                <Footer value={this.state.imageSizing} onChange={this.handleImageSizing} />

                {
                    this.state.showInfo &&
                    <AlbumModal
                        artist={this.state.artistName}
                        album={this.state.albumName}
                        album={this.state.albumName}
                        year={this.state.albumYear}
                        albumLink={this.state.albumPlayLink}
                        closeAlbum={this.closeAlbumInfo}
                    />
                }
            </div>
        );
    }
}

ReactDOM.render(<SpotCoverApp />, document.getElementById("root"));
