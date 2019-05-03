import React from 'react';

const Footer = (props) => {
    return (
        <div className="footer">
            <div className="footerText perRowSelection">
                <p>Images Per Row</p>
                <select value={props.value} onChange={props.onChange}>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
            </div>

            <div className="footerText">
                <p>2019 © Karo Kuusikallio</p>
            </div>

        </div>
    )
}

export default Footer;