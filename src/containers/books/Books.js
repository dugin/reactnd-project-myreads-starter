import React from 'react';
import './Books.css';
import {getAll} from "../../api/BooksAPI";
import {Link} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import Book from "../book/Book";


class Books extends React.Component {

    constructor(props) {
        super(props);

        this.state = {books: [], isOpen: []};
    }

    toggle(id) {
        this.setState({
            isOpen: {
                [id]: typeof  this.state.isOpen[id] === 'undefined' ? true : !this.state.isOpen[id]
            }
        });
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
    };

    render() {
        return (
            <div className="container Books">

                <div className="card card-container mt-3 ">
                    <h2 className="title"> My Reads</h2>
                </div>
                <h3 className="mt-4 group-title"> Currently Reading</h3>
                <div className="row mx-0  mt-4">

                    {this.state.books.map((book, z) => (
                       <Book key={z} book={book} index={z}/>
                    ))}
                </div>
                <Link to="/search" className="floating-btn">+</Link>
            </div>
        )
    }
}

export default Books;
