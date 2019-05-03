import React from 'react';

const ImageRender = (props) => {
    let imageSizing = `PerRow${props.sizing}`;

    let albumImageRender = [];
    props.albumUrls.map(album => {
        albumImageRender.push(<img src={album[1]} className={`singleImage ${imageSizing}`} key={album[0]} onClick={e => props.showAlbumInfo(album[0])} />)
    });

    return (

        <div className="imageContainer">
            {albumImageRender}
        </div>
    )
}

export default ImageRender;