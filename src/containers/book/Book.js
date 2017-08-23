import {Dropdown, DropdownToggle, DropdownMenu, Badge, DropdownItem} from 'reactstrap';
import React from 'react';
import './Book.css';
import PropTypes from 'prop-types';

const noImage = require('../../assets/images/default-no-image.png');


class Book extends React.Component {

    constructor(props) {
        super(props);

        this.state = {isOpen: [], category: this.getCategory(this.props.shelfCategories, this.props.book.shelf)};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({category: this.getCategory(nextProps.shelfCategories, nextProps.book.shelf)})
    }

    getCategory(shelfCategories, shelf) {
        return shelfCategories.filter(category => category.type.localeCompare(shelf) === 0)[0];
    }

    toggle = (id) => {
        this.setState({
            isOpen: {
                [id]: typeof  this.state.isOpen[id] === 'undefined' ? true : !this.state.isOpen[id]
            }
        });
    };

    updateBook = (book, shelf) => {
        this.props.updateBook(book, shelf);
    };

    render() {
        return (
            <div className="Book card card-container mb-2 col-md-4 col-lg-3 col-sm-6 col-xl-3">
                {this.state.category && (
                    <Badge style={{backgroundColor: this.state.category.color}}
                           className="badge"> {this.state.category.name}</Badge>
                )}
                <div className="img-container">
                    <img className="card-img-top"
                         src={this.props.book.imageLinks.smallThumbnail || noImage}
                         alt="Book"/>
                </div>
                <div className="card-body pb-0 mb-3">
                    <h5 className="card-title mb-1">{this.props.book.title}</h5>
                    <p className="card-subtitle">{this.props.book.subtitle}</p>

                    <p className="card-text">
                        by {this.props.book.authors && this.props.book.authors.map((author, i) => (
                        <span className="card-authors"
                              key={i}>{author}{i !== this.props.book.authors.length - 1 && ', '} </span>))} </p>
                </div>
                <div className="card-footer">
                    <Dropdown isOpen={this.state.isOpen[this.props.index]}
                              toggle={() => this.toggle(this.props.index)}>
                        <DropdownToggle className="card-footer-options" caret>
                            Options
                        </DropdownToggle>
                        <DropdownMenu className={this.state.isOpen[this.props.index] ? "show" : ""}>
                            {this.props.shelfCategories.map(category => (
                                <DropdownItem key={category.type}
                                              disabled={this.state.category && this.state.category.type.localeCompare(category.type) === 0}
                                              onClick={() => this.updateBook(this.props.book, category.type)}>
                                    {category.name} </DropdownItem>
                            ))}

                            <DropdownItem divider/>
                            <DropdownItem onClick={() => this.updateBook(this.props.book, 'none')}>None</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

        )
    }
}

Book.propTypes = {
    book: PropTypes.object.isRequired,
    shelfCategories: PropTypes.array.isRequired,
    updateBook: PropTypes.func,
    index: PropTypes.number.isRequired
};

export default Book;