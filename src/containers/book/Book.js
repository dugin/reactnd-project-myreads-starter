import {Dropdown, DropdownToggle, DropdownMenu, Badge, DropdownItem} from 'reactstrap';
import React from 'react';
import './Book.css';
import PropTypes from 'prop-types';
import Rating from './../rating/Rating';
import {findRating} from "../../api/RatingFirebase";
import Loader from '../../components/loader/Loader';

const noImage = require('../../assets/images/default-no-image.png');
import StarRatingComponent from 'react-star-rating-component';

class Book extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: [],
            category: this.getCategory(this.props.shelfCategories, this.props.book.shelf),
            isRatingOpened: false,
            isLoadingRating: false,
            rating: {averageRating: this.props.book.averageRating, ratingsCount: this.props.book.ratingsCount},
            isLoadingShelfChange: false
        };
    }

    componentDidMount() {
        if (this.props.shouldGetRating) {
            this.setState({isLoadingRating: true});

            findRating(this.props.book.id)
                .then(snapshot => {
                    const resp = snapshot.val();

                    if (resp) {
                        this.updateRating(resp);
                    }
                    this.setState({isLoadingRating: false});
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            category: this.getCategory(nextProps.shelfCategories, nextProps.book.shelf),
            rating: {averageRating: nextProps.book.averageRating, ratingsCount: nextProps.book.ratingsCount},
            isLoadingShelfChange: false
        });
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

    openRating = () => {
        this.setState({isRatingOpened: !this.state.isRatingOpened})
    };

    checkCategory = () => {
        return this.state.category && (
            this.state.category.type.localeCompare('read') === 0 ||
            this.state.category.type.localeCompare('currentlyReading') === 0);
    };

    updateShelf = (book, shelf) => {
        this.setState({isLoadingShelfChange: true});
        this.props.updateShelf(book, shelf);
    };

    updateRating = (rating) => {
        this.props.updateRating(this.props.book, rating);
    };

    render() {
        return (
            <div className="Book card card-container mb-2 col-md-4 col-lg-3 col-sm-6 col-xl-3">
                {this.state.category && (
                    <Badge style={{backgroundColor: this.state.category.color}}
                           className="badge"> {this.state.category.name}</Badge>
                )}
                {(this.state.isLoadingShelfChange || this.state.isLoadingRating) &&   (
                    <div className="loader-container"><Loader/>
                    </div>)}

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
                {this.state.rating.averageRating && !this.state.isLoadingRating && (
                    <div className="rating-wrapper">
                        <StarRatingComponent
                            name="rateBook"
                            starColor="#ffb400"
                            emptyStarColor="#ffb400"
                            editing={false}
                            value={this.state.rating.averageRating}
                            renderStarIcon={(index, value) => {
                                return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'}/>;
                            }}
                            renderStarIconHalf={() => <span className="fa fa-star-half-full"/>}
                        />
                        <div className="rating-amount">{this.state.rating.ratingsCount} reviews</div>
                    </div>)}
                <div className="card-footer">
                    {this.checkCategory() && (
                        <button onClick={this.openRating} className="btn btn-outline-warning"> Rate it!</button>
                    )}
                    <Dropdown isOpen={this.state.isOpen[this.props.index]}
                              toggle={() => this.toggle(this.props.index)}>
                        <DropdownToggle className="card-footer-options" caret>
                            Move to...
                        </DropdownToggle>
                        <DropdownMenu className={this.state.isOpen[this.props.index] ? "show" : ""}>
                            {this.props.shelfCategories.map(category => (
                                <DropdownItem key={category.type}
                                              disabled={this.state.category && this.state.category.type.localeCompare(category.type) === 0}
                                              onClick={() => this.updateShelf(this.props.book, category.type)}>
                                    {category.name} </DropdownItem>
                            ))}
                            <DropdownItem divider/>
                            <DropdownItem onClick={() => this.updateShelf(this.props.book, 'none')}>None</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {this.state.isRatingOpened ?
                    <Rating className="Rating"
                            book={this.props.book}
                            onRating={this.updateRating}
                            onCloseModal={() => this.setState({isRatingOpened: false})}/> :
                    null
                }
            </div>

        )
    }
}

Book.propTypes = {
    book: PropTypes.object.isRequired,
    shelfCategories: PropTypes.array.isRequired,
    updateShelf: PropTypes.func,
    updateRating: PropTypes.func,
    index: PropTypes.number.isRequired,
    shouldGetRating: PropTypes.bool.isRequired
};

export default Book;