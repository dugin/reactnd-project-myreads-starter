import React from 'react';
import './Books.css';
import {getAll} from "../../api/BooksAPI"


class Books extends React.Component {

    constructor(props) {
        super(props);
        this.state = {books: []};
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        getAll()
            .then(val => {
                this.setState({books: val});

                console.log(val);
            });

    }


    render() {
        return (
            <div className="container Books">
                <div className="card card-container mt-3 ">
                    <h2 className="title"> My Reads</h2>
                </div>
                <h3 className="mt-4 group-title"> Currently Reading</h3>
                <div className="row mx-0  mt-4">

                    {this.state.books.map(book => (
                        <div className="card card-container col-md-6 col-lg-4 col-sm-12">
                            <div className="img-container">
                                <img className="card-img-top"
                                     src={book.imageLinks.smallThumbnail}
                                     alt="Book"/>
                            </div>
                            <div className="card-body pb-0 mb-3">
                                <h5 className="card-title mb-1">{book.title}</h5>
                                <p className="card-text"> {book.authors.map((author, i) => (
                                    <span key={i}>{author}{i !== book.authors.length - 1 && ', '} </span>))}</p>
                            </div>
                            <div className="card-body pt-0 ">
                                <p className="card-link-title"> Move to...</p>
                                <div className="card-link-wrapper">
                                    <button className="btn   btn-outline-primary">Currently Reading</button>
                                    <button className="btn  btn-outline-primary">Read</button>
                                    <button className="btn  btn-outline-primary">Want to Read</button>
                                    <button className="btn    btn-outline-primary">None</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="floating-btn btn btn-primary" type="submit">+</button>
            </div>
        )
    }
}

export default Books;
