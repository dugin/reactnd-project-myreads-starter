import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import StarRatingComponent from 'react-star-rating-component';
import './Rating.css';
import moment from 'moment';
import {setRating} from "../../api/RatingFirebase";
import serializeForm from 'form-serialize';


class Rating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            rating: -1
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

    onReview = (e) => {
        e.preventDefault();
        const values = serializeForm(e.target, {hash: true});

        values.createdAt = moment().toJSON();
        values.rate = this.state.rating;
        values.name =  values.name || 'anonymous';

        setRating(this.props.book.id, values);
        this.toggle();

    };

    render() {
        return (
            <div >
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.props.book.title}</ModalHeader>
                    <ModalBody>
                        <div className="rating-wrapper">
                        <StarRatingComponent
                            name="app5"
                            starColor="#ffb400"
                            emptyStarColor="#ffb400"
                            onStarClick={this.onStarClick.bind(this)}
                            renderStarIcon={(index, value) => {
                                return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'} />;
                            }}
                            renderStarIconHalf={() => <span className="fa fa-star-half-full" />}
                        />
                        </div>
                        <form onSubmit={this.onReview}>
                            <input type="text" name="name" className="form-control" placeholder="Your name"/>
                            <input type="text" name="title" className="form-control" placeholder="Review Title"/>
                            <textarea name="text"  className="form-control" placeholder="Review text" rows="4" cols="50"/>
                            <button className="btn btn-primary">Save</button>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

Rating.propTypes = {
    book: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired,
};

export default Rating;