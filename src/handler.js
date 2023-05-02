const { nanoid } = require('nanoid');
const arrayBooks = require('./books');

const insertBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = Boolean(pageCount === readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  arrayBooks.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBook = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const book = arrayBooks.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));

    if (book.length) {
      return h.response({
        status: 'success',
        data: {
          books: book.map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
        },
      }).code(200);
    }

    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
  if (reading) {
    if (reading === '1') {
      const bookRead = arrayBooks.filter((n) => n.reading === true);

      return h.response({
        status: 'success',
        data: {
          books: bookRead.map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
        },
      }).code(200);
    }
    if (reading === '0') {
      const bookUnRead = arrayBooks.filter((n) => n.reading === false);

      return h.response({
        status: 'success',
        data: {
          books: bookUnRead.map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
        },
      }).code(200);
    }
  }
  if (finished) {
    if (finished === '1') {
      const bookFinished = arrayBooks.filter((n) => n.finished === true);

      return h.response({
        status: 'success',
        data: {
          books: bookFinished.map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
        },
      }).code(200);
    }
    if (finished === '0') {
      const bookUnFinished = arrayBooks.filter((n) => n.finished === false);

      return h.response({
        status: 'success',
        data: {
          books: bookUnFinished.map((n) => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher,
          })),
        },
      }).code(200);
    }
  }

  return h.response({
    status: 'success',
    data: {
      books: arrayBooks.map((n) => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      })),
    },
  }).code(200);
};

const getBookById = (request, h) => {
  const { id } = request.params;

  const book = arrayBooks.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookById = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = arrayBooks.findIndex((book) => book.id === id);

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  if (index !== -1) {
    arrayBooks[index] = {
      ...arrayBooks[index],
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

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = arrayBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    arrayBooks.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  insertBookHandler,
  getAllBook,
  getBookById,
  editBookById,
  deleteBookById,
};
