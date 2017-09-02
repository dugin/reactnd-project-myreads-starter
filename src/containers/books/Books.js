import React from 'react';
import './Books.css';
import * as BooksAPI from "../../api/BooksAPI";
import {Link} from 'react-router-dom';
import Book from "../book/Book";
import {categories} from "../../utils/constants";
import Loader from '../../components/loader/Loader';
import PropTypes from 'prop-types';


class Books extends React.Component {

    constructor(props) {
        super(props);
        this.state = {books: [], isLoading: true, shouldGetRating: true};
    }

    componentDidMount() {

        if (!this.props.updatedShelf || this.props.updatedShelf.length === 0)
            this.getAllBooks();

        else
            this.init(this.props.updatedShelf);
    }

    init(val) {
        this.setState({books: val, isLoading: false});
        this.props.shelfBooks(val);
    }

    componentWillReceiveProps(){
        this.setState({shouldGetRating: false});
    }

    getAllBooks = () => {
        BooksAPI.getAll()
            .then(val => {
                this.init(val);
            });
    };

    updateShelf = (book, shelf) => {

        BooksAPI.update(book, shelf)
            .then(() => {

                this.setState(state => ({
                    books: state.books.map(b => b.id === book.id ? {...b, shelf} : b)
                }), () => {
                    this.props.shelfBooks(this.state.books);
                });
            })
    };

    updateRating = (book, rating) => {

        this.setState(state => ({
            books: state.books.map(b => {
                if (b.id === book.id) {
                    b.averageRating = rating.averageRating;
                    b.ratingsCount = rating.ratingsCount;
                }
                return b;
            })
        }), () => {
            this.props.shelfBooks(this.state.books);
        });
    };

    render() {
        return (
            <div className="container Books">

                <div className="card card-container mt-3 ">
                    <h2 className="title"> My Reads</h2>
                </div>

                <div className="books-container">
                    {this.state.isLoading ? (
                            <Loader/>
                        ) :
                        (categories.map(category => (
                                <div key={category.type}>
                                    <h3 className="mt-4 group-title"> {category.name}</h3>
                                    <div className="row mx-0  mt-4">
                                        {this.state.books
                                            .filter(book => book.shelf.localeCompare(category.type) === 0)
                                            .map((book, z) => (
                                                <Book key={z}
                                                      book={book}
                                                      shelfCategories={categories}
                                                      updateShelf={this.updateShelf}
                                                      updateRating={this.updateRating}
                                                      shouldGetRating={this.state.shouldGetRating}
                                                      index={z}/>
                                            ))}
                                    </div>
                                </div>
                            ))
                        )}
                </div>

                <Link to="/search" className="floating-btn">+</Link>
            </div>

        )
    }
}

Books.propTypes = {
    shelfBooks: PropTypes.func,
    updatedShelf: PropTypes.array,
    shouldGetRating: PropTypes.bool
};

export default Books;
