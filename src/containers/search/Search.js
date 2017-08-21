import React from 'react';
import './Search.css';
import Book from "../book/Book";
import Loader from '../../components/loader/Loader'

const arrowImg = require('../../assets/icons/arrow-back.svg');
import {search, getAll} from "../../api/BooksAPI";
import {categories} from "../../utils/constants";


class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {books: [], error: '', isLoading: false};

        this.shelfBooks = props.shelfBooks;
    }

    componentDidMount() {
        this.checkShelfBooks();
    }

    checkShelfBooks() {
        if (!this.shelfBooks)
            getAll()
                .then(val => {
                    this.shelfBooks = val;
                })
    }

    checkBooks = (book) => {
        return this.shelfBooks
            .filter(b => b.id === book.id)
            .map(b => {
                    book.shelf = b.shelf;
                    return book;
                }
            )[0] || book;
    };

    onTyping = (e) => {
        const val = e.target.value;

        clearTimeout(this.timeout);

        if (val.length > 0)
            this.timeout = setTimeout(() => {
                this.setState({isLoading: true});
                this.getBooks(val);
            }, 500);
    };

    getBooks(query) {
        search(query)
            .then(response => {
                response.error ? this.setState({books: [], error: response.error}) : this.setState({books: response});

                this.setState({isLoading: false});
            })

    }

    render() {

        return (
            <div className="Search container">
                <div className="search-box">
                    <i className=" fa fa-search"/>
                    <input onChange={this.onTyping} className="search-input form-control" type="text"
                           placeholder="Search by Title or Author"/>
                </div>
                <div className="search-content">
                    {this.state.isLoading ? (
                        <Loader/>
                    ) : (
                        <div className="row mx-0  mt-4">
                            {this.state.books.length > 0 ? (
                                this.state.books.map((book, z) => (
                                    <Book key={z} book={this.checkBooks(book)} shelfCategories={categories} index={z}/>
                                ))
                            ) : this.state.error.length > 0 && ( <h1> No results</h1>)}
                        </div>
                    )}
                </div>

            </div>
        )
    }
}

export default Search;