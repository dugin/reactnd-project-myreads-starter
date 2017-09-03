import React from 'react';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import StarRatingComponent from 'react-star-rating-component';
import './Rating.css';
import {increaseRating, setRating, findRating} from "../../api/RatingFirebase";
import {ratings} from "../../utils/constants"

import {increaseRatingObj} from "../../utils/utils";
const spinner = require('../../assets/icons/spinner.svg');


class Rating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            rating: -1,
            isSaving: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
        this.props.onCloseModal();
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    onReview = () => {
        const ratingObj = {averageRating: this.props.book.averageRating, ratingsCount: this.props.book.ratingsCount};

        this.setState({isSaving: true});

        findRating(this.props.book.id)
            .then(snapshot => {
                const resp = snapshot.val();

                if (ratingObj.averageRating && ratingObj.averageRating && !resp) {
                    const increasedRating = increaseRatingObj(ratingObj, this.state.rating);
                    return setRating(this.props.book.id, increasedRating);
                }
                else
                    return increaseRating(this.props.book.id, this.state.rating);
            })
            .then(resp => {
                this.setState({isSaving: false});
                this.props.onRating(resp);
                this.toggle();

            });
    };

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.props.book.title}</ModalHeader>
                    <ModalBody>
                        <div className="rating-wrapper">
                            <StarRatingComponent
                                name="app5"
                                starColor="#ffb400"
                                emptyStarColor="#ffb400"
                                onStarClick={this.onStarClick.bind(this)}
                                value={this.state.rating}
                                renderStarIcon={(index, value) => {
                                    return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'}/>;
                                }}
                                renderStarIconHalf={() => <span className="fa fa-star-half-full"/>}
                            />
                            <p className="rating-msg"> {this.state.rating !== -1 && ratings[this.state.rating - 1]}</p>
                        </div>

                        <button disabled={this.state.rating === -1 || this.state.isSaving} onClick={() => this.onReview()}
                                className="btn btn-primary"> {this.state.isSaving? (<img src={spinner} alt=""/>) : (<span>Save</span>) }
                        </button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

Rating.propTypes = {
    book: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onRating: PropTypes.func.isRequired
};

export default Rating;