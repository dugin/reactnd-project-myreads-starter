export const increaseRatingObj = (current, newRating) => {
    return {
        averageRating: (current.averageRating * current.ratingsCount + newRating) / (current.ratingsCount + 1),
        ratingsCount: current.ratingsCount + 1
    }
};

export const isBookOnArray = (bookID, books) => {
    return books.findIndex(b => b.id === bookID);
};

export const alterBookShelf = (book, shelfBooks) => {
    const shelfBook = shelfBooks.find(b => b.id === book.id);

    return shelfBook ? {...book, shelf: shelfBook.shelf} : book;
};