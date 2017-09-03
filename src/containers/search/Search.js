import React from 'react';
import './Search.css';
import Book from "../book/Book";
import Loader from '../../components/loader/Loader';
import * as BooksAPI from "../../api/BooksAPI";
import {categories} from "../../utils/constants";
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import {isBookOnArray, alterBookShelf} from "../../utils/utils";

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {books: [], error: '', isLoading: false};

        this.shelfBooks = props.shelfBooks;
    }

    componentDidMount() {
        if (this.shelfBooks.length === 0)
            BooksAPI.getAll()
                .then(val => {
                    this.shelfBooks = val;
                })
    }

    checkBooks = (book) => {
        return alterBookShelf(book, this.shelfBooks);
    };

    componentWillMount() {
        this.onSearch = debounce(this.onSearch, 600);
        this.props.updatedShelf(this.props.shelfBooks);
    }

    onTyping = (e) => {
        if (e.target.value.length > 0)
            this.onSearch(e.target.value);
    };

    onSearch = (val) => {
        this.setState({isLoading: true});
        this.getBooks(val);
    };


    updateRating = (book, rating) => {
        let isOnShelf = isBookOnArray(book.id, this.shelfBooks);

        if (isOnShelf > -1) {
            this.shelfBooks[isOnShelf].averageRating = rating.averageRating;
            this.shelfBooks[isOnShelf].ratingsCount = rating.ratingsCount;
        }

        this.setState(state => ({
            books: state.books.map(b => {
                if (b.id === book.id) {
                    b.averageRating = rating.averageRating;
                    b.ratingsCount = rating.ratingsCount;
                }
                return b;
            }),
        }));

    };

    updateBook = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(() => {

                this.addBookOnShelf(book, shelf);

                this.setState(state => ({
                    books: state.books.map(b => b.id === book.id ? {...b, shelf} : b)
                }));
            })
    };

    addBookOnShelf(book, shelf) {
        let isOnShelf = isBookOnArray(book.id, this.shelfBooks);

        if (typeof isOnShelf === 'number')
            this.shelfBooks[isOnShelf] = {...book, shelf};

        else
            this.shelfBooks.push({...book, shelf});

        this.props.updatedShelf(this.shelfBooks);
    }

    getBooks(query) {
        BooksAPI.search(query)
            .then(response => {
                if (response.error)
                    throw new Error(response.error);

                this.setState({isLoading: false, books: response});
            })
            .catch(error => {
                this.setState({isLoading: false, books: [], error: error.message})
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
                                          updateShelf={this.updateBook}
                                          updateRating={this.updateRating}
                                          shouldGetRating={true}
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