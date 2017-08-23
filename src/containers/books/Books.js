import React from 'react';
import './Books.css';
import * as BooksAPI from "../../api/BooksAPI";
import {Link} from 'react-router-dom';
import Book from "../book/Book";
import {categories} from "../../utils/constants";
import Loader from '../../components/loader/Loader';


class Books extends React.Component {

    constructor(props) {
        super(props);
        this.state = {books: [], isLoading: true};
    }

    componentDidMount() {
        this.getAllBooks();
    }

    getAllBooks = () => {
        BooksAPI.getAll()
            .then(val => {
                this.setState({books: val, isLoading: false});
                this.props.shelfBooks(val);
                console.log(val);
            });
    };

    updateBook = (book, shelf) => {
        BooksAPI.update(book, shelf)
            .then(() => {

                book.shelf = shelf;

                this.setState(state => ({
                    books: state.books.map(b => b.id === book.id ? book : b)
                }));
            })
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
                                                      updateBook={this.updateBook}
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

export default Books;
