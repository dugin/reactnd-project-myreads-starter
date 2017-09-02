import firebase from 'firebase';
import {increaseRatingObj} from '../utils/utils'

export const setRating = (id, ratingObj) => {
    const ratingsRef = firebase.database().ref(`ratings/${id}`);

      return ratingsRef.set(ratingObj)
            .then(() => Promise.resolve(ratingObj));
};

export const increaseRating = (id, newRating) => {
    const ratingsRef = firebase.database().ref(`ratings/${id}`);

    return new Promise((resolve, reject) => {
        ratingsRef.transaction((currentData) => {
            if (!currentData)
                return {averageRating: newRating, ratingsCount: 1};
            else
                return increaseRatingObj(currentData, newRating);

        }, (error, committed, snapshot) => {
            if (error) {
                reject('Transaction failed abnormally!', error)
            } else if (!committed) {
                reject('We aborted the transaction (because ada already exists).');
            }
            resolve(snapshot.val());
        });
    })
};

export const findRating = (id) => {
    const ratingsRef = firebase.database().ref(`ratings/${id}`);
    return ratingsRef.once("value");
};


