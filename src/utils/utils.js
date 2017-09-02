export const increaseRatingObj = (current, newRating) => {
    return {
        averageRating: (current.averageRating * current.ratingsCount + newRating) / (current.ratingsCount + 1),
        ratingsCount: current.ratingsCount + 1
    }
};

export const isBookOnArray = (bookID, books) => {
    for(let i = 0; i < books.length; i++)
        if(bookID === books[i].id)
            return i;

    return false;
};

export const alterBookShelf = (book, shelfBooks) => {
    return shelfBooks
        .filter(b => b.id === book.id)
        .map(b => {
                return {...book, shelf: b.shelf};
            }
        )[0] || book;
};