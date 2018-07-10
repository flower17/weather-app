import React from 'react';


import './footer.scss';

const Footer = props => {
    return (
        <footer className="footer">
            <div className="first-row">
                Made with love <span role="img" aria-label="love">💗</span> 
                and sun <span role="img" aria-label="sun">🌞</span>  in 2018.{'\u00A0'} 
                <a href="https://github.com/flower17" target="_blank"
                   rel="noopener noreferrer">
                    Source code
                </a>.
                <label htmlFor="credits"> Credits</label>.
            </div>
            <input type="checkbox" id="credits" />
            <div className="resources">
                Data providers: 
                <ul>
                    <li>
                        <a href="http://ipstack.com" target="_blank" rel="noopener noreferrer">
                            ipstack.com
                        </a>
                    </li>
                    <li>
                        <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">
                            openweathermap.org
                        </a>
                    </li>
                    <li>
                        <a href="https://timezonedb.com/" target="_blank" rel="noopener noreferrer">
                            timezonedb.com
                        </a>
                    </li>
                </ul>
            </div>
            <div className="resources">
                Graphic assets: 
                <ul>
                    <li>
                        <a href="https://www.iconfinder.com/Neolau1119/icon-sets" target="_blank"
                           rel="noopener noreferrer">
                            Yun Liu
                        </a>
                    </li>
                    <li>
                        <a href="https://www.iconfinder.com/justui" target="_blank" rel="noopener noreferrer">
                            Just UI
                        </a>
                    </li>
                    <li>
                        <a href="https://www.iconfinder.com/Juliia_Os" target="_blank" rel="noopener noreferrer">
                            Juliia Osadcha
                        </a>
                    </li>
                    <li>
                        <a href="https://www.flaticon.com/authors/pixel-perfect" target="_blank"
                           rel="noopener noreferrer">
                            Pixel perfect
                        </a>
                    </li>
                    <li>
                        <a href="https://www.iconfinder.com/yanlu" target="_blank" rel="noopener noreferrer">
                            Yannick Lung
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;