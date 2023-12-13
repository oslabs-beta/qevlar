const data = {
  authors: [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
  ],

  books: [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
  ],
  characters: [
    { id: 1, name: 'Harry Potter', houseId: 1 },
    { id: 2, name: 'Hermione Granger', houseId: 1 },
    { id: 3, name: 'Ron Weasley', houseId: 1 }
  ],
  houses: [
    { id: 1, name: 'Gryffindor' }
  ]
}
module.exports = data;