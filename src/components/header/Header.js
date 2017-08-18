import * as React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

const udacityImg = require('../../assets/icons/udacity.svg');

const Header = (props) => {

    return (<nav className="navbar Header">
        {props.route.localeCompare('/') !== 0 && (
            <Link to="/"> <i className="fa fa-arrow-left" aria-hidden="true"/></Link>)}
        <div className="container pl-md-0  ">
            <a className="navbar-brand">
                <img src={udacityImg} height="30" alt="udacity logo"/>
            </a>
        </div>
    </nav>)

}
export default Header;