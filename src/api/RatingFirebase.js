import firebase from 'firebase';

export const setRating = (id, rating) => {
    const ratingsRef = firebase.database().ref(`ratings/${id}`);
    const reviewsRef = firebase.database().ref(`reviews/${id}`);

    ratingsRef.transaction((currentData) => {
        if (!currentData)
            return {total: rating.rate, amount: 1};
        else
            return {total: currentData.total + rating.rate, amount: currentData.amount + 1};

    }, (error, committed, snapshot) => {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the transaction (because ada already exists).');
        } else {
            console.log('User ada added!');

            reviewsRef.push(rating);
        }

    });

}
