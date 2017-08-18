import * as React from 'react';
import './Header.css';
const udacityImg = require('../../assets/icons/udacity.svg');

const Header = () => {

    return (<nav className="navbar Header">
        <div className="container">
        <a className="navbar-brand">
            <img src={udacityImg}  height="30" alt="udacity logo"/>
        </a>
        </div>
    </nav>)


};
export default Header;