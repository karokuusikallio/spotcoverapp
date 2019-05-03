import React from 'react';

const AlbumModal = (props) => {
    return (
        <div className="albumInfoModal" onClick={e => { props.closeAlbum(e) }}>
            <div className="albumInfoContent">
                <h2>Album Info</h2>
                <p>{`Artist: ${props.artist}`}</p>
                <p>{`Album: ${props.album}`}</p>
                <p>{`Year: ${props.year}`}</p>
                <a href={props.albumLink} target="_blank" className="playbutton">Play the Album</a>
            </div>
        </div>
    )
}

export default AlbumModal;