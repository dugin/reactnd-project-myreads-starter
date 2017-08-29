import React from 'react'
import './App.css'
import Header from "./../components/header/Header";
import Footer from "./../components/footer/Footer";
import Books from "./books/Books";
import Search from './search/Search';
import {withRouter, Route} from 'react-router-dom'

class BooksApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {route: window.location.pathname, shelfBooks:[]};

        this.props.history.listen((location, action) => {
            this.setState({route: location.pathname})
        });
    }

    render() {
        return (
            <div className="app">
                <Header route={this.state.route}/>
                <Route exact path="/" render={()=>(
                    <Books
                        shelfBooks={(books) => this.setState({shelfBooks: books})}
                        updatedShelf={this.state.shelfBooks}

                    />
                )}/>
                <Route path="/search" render={()=>(
                    <Search shelfBooks={this.state.shelfBooks}
                            updatedShelf={(books) => this.setState({shelfBooks: books})}
                    />
                )}/>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(BooksApp)
