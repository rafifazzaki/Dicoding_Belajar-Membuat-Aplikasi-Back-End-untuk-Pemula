const { nanoid } = require('nanoid');
const _books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (name == '' || name == undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished,
    };

    _books.push(newBook);

    const isSuccess = _books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku',
    });
    response.code(400);
    return response;
};

// HERE IS THE ONE THAT SHOULD BE DONE
const getAllBooksHandler = (request) => {
    const { reading, finished, name } = request.query;
    let booksFiltered;

    let books = _books.map((book) => {
        if (book.readPage == book.pageCount) {
            book.finished = true;
        }
    });

    // const books = _books

    if (reading != undefined) {
        if (reading == 1) {
            booksFiltered = _books.filter((n) => n.reading == reading);
        } else if (reading == 0) {
            booksFiltered = _books.filter((n) => n.reading == reading);
        }
    }

    // why does it

    if (finished != undefined) {
        if (finished == 1) {
            booksFiltered = _books.filter((n) => n.finished == finished);
        } else if (finished == 0) {
            booksFiltered = _books.filter((n) => n.finished == finished);
        }
    }

    if (name != undefined) {
        const lowerCaseName = name.toLowerCase();
        booksFiltered = _books.filter((n) => n.name.toLowerCase().includes(lowerCaseName));
        console.log(booksFiltered);
    }

    if (booksFiltered != undefined) {
        books = booksFiltered.map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher,
        }));
    } else {
        books = _books.map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher,
        }));
    }

    return {
        status: 'success',
        data: {
            books,
        },
    };
};
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = _books.filter((n) => n.id === id)[0];

    if (book != undefined) {
    // what is this?
        if (book.readPage === book.pageCount) {
            book.finished = true;
        }

        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = _books.findIndex((note) => note.id === id);

    if (name == undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
        _books[index] = {
            ..._books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = _books.findIndex((book) => book.id === id);

    if (index !== -1) {
        _books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
