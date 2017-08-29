import React from 'react';
import './Search.css';
import Book from "../book/Book";
import Loader from '../../components/loader/Loader'
import * as BooksAPI from "../../api/BooksAPI";
import {categories} from "../../utils/constants";
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

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
        if (this.shelfBooks.length === 0)
            BooksAPI.getAll()
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

    componentWillMount() {
        this.onSearch = debounce(this.onSearch, 600);
        this.props.updatedShelf( this.props.shelfBooks);
    }

    onTyping = (e) => {
        if (e.target.value.length > 0)
            this.onSearch(e.target.value)
    };

    onSearch = (val) => {
        this.setState({isLoading: true});
        this.getBooks(val);
    };

    isBookOnShelf(book, shelf) {
        let isOnShelf = false;

        this.shelfBooks = this.shelfBooks.map(b => {
            if (b.id === book.id) {
                isOnShelf = true;
                return {...b, shelf};
            }
            return b;
        });

        if (!isOnShelf)
            this.shelfBooks.push({...book, shelf});

        this.props.updatedShelf(this.shelfBooks);
    }

    updateBook = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(() => {

                this.isBookOnShelf(book, shelf);

                this.setState(state => ({
                    books: state.books.map(b => b.id === book.id ? {...b, shelf} : b)
                }));

            })
    };

    getBooks(query) {
        BooksAPI.search(query)
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
                                    <Book key={z}
                                          book={this.checkBooks(book)}
                                          shelfCategories={categories}
                                          updateBook={this.updateBook}
                                          updateShelf={(newShelf) => this.setState({books: newShelf})}
                                          index={z}/>
                                ))
                            ) : this.state.error.length > 0 && ( <h1> No results</h1>)}
                        </div>
                    )}
                </div>

            </div>
        )
    }
}

Search.propTypes = {
    shelfBooks: PropTypes.array,
    updatedShelf: PropTypes.func,

};


export default Search;