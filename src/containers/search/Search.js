import React from 'react';
import './Search.css';
const arrowImg = require('../../assets/icons/arrow-back.svg');

class Search extends React.Component{

     render(){

         return (
             <div className="Search container">

                 <i className=" fa fa-search" aria-hidden="true"/>
                 <input className="search-input form-control" type="text" placeholder="Search by Title or Author"/>

             </div>
         )
     }
}

export default Search;