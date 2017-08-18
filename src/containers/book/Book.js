import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import React from 'react';
import './Book.css';


class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: []};
    }

    toggle(id) {
        this.setState({
            isOpen: {
                [id]: typeof  this.state.isOpen[id] === 'undefined' ? true : !this.state.isOpen[id]
            }
        });
    }

    render() {
        return (
                <div className="Book card card-container mb-2 col-md-4 col-lg-3 col-sm-6 col-xl-3">
                    <div className="img-container">
                        <img className="card-img-top"
                             src={this.props.book.imageLinks.smallThumbnail}
                             alt="Book"/>
                    </div>
                    <div className="card-body pb-0 mb-3">
                        <h5 className="card-title mb-1">{this.props.book.title}</h5>
                        <p className="card-text"> {this.props.book.authors.map((author, i) => (
                            <span key={i}>{author}{i !== this.props.book.authors.length - 1 && ', '} </span>))} </p>
                    </div>
                    <div className="card-footer">
                        <Dropdown isOpen={this.state.isOpen[this.props.index]}
                                  toggle={() => this.toggle(this.props.index)}>
                            <DropdownToggle className="card-footer-options" caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu className={this.state.isOpen[this.props.index] ? "show" : ""}>
                                <DropdownItem>Currently Reading</DropdownItem>
                                <DropdownItem>Read</DropdownItem>
                                <DropdownItem>Want to Read</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>None</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

        )
    }
}

export default Book;