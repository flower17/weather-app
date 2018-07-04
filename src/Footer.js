import React from 'react';


import './footer.scss';

const Footer = props => {
    return (
        <footer className="footer">
            <div className="first-row">
                Made with love 💗 and sun 🌞  in 2018. <a href="https://github.com/flower17" target="_blank">Source code</a>.
                <label htmlFor="credits"> Credits</label>
            </div>
            <input type="checkbox" id="credits" />
            <div className="resources">
                Data providers: 
                <ul>
                    <li><a href="http://ipstack.com" target="_blank">ipstack.com</a></li>
                    <li><a href="https://openweathermap.org" target="_blank">openweathermap.org</a></li>
                    <li><a href="https://timezonedb.com/" target="_blank">timezonedb.com</a></li>
                </ul>
            </div>
            <div className="resources">
                Graphic assets: 
                <ul>
                    <li><a href="https://www.iconfinder.com/Neolau1119/icon-sets" target="_blank">Yun Liu</a></li>
                    <li><a href="https://www.iconfinder.com/justui" target="_blank">Just UI</a></li>
                    <li><a href="https://www.iconfinder.com/Juliia_Os" target="_blank">Juliia Osadcha</a></li>
                    <li><a href="https://www.flaticon.com/authors/pixel-perfect" target="_blank">Pixel perfect</a></li>
                    <li><a href="https://www.iconfinder.com/yanlu" target="_blank">Yannick Lung</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;