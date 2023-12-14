const app = require('express')();
const { expressGraphQL, graphqlHTTP } = require('express-graphql');
const { books, authors, characters, houses } = require('./db.js');
const { qevlarSecurity } = require('./qevlarSecurity.js');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');

//define a new GraphQL object type for a book 
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: "book written by author",
  //define the fields of the book type
  fields: () => ({
    //define id field of a non-nullable int
    id: { type: GraphQLNonNull(GraphQLInt) },
    //define name field of a non-nullable string
    name: { type: GraphQLNonNull(GraphQLString) },
    //define authorId field of a non-nullable int
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    //define the author field 
    author: {
      //specify the type, AuthorType
      type: AuthorType,
      //define resolve function to fetch author info for the book
      resolve: (book) => {
        //find the author whose id matches the book's author id
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

//define AuthorType which is a new GraphQL obj
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: "author of book",
  //define fields of author type
  fields: () => ({
    //define id field of a non-nullable int
    id: { type: GraphQLNonNull(GraphQLInt) },
    //define name field of a non-nullable string
    name: { type: GraphQLNonNull(GraphQLString) },
    //define the books field
    books: {
      //specify type, which is a list of book type
      type: GraphQLList(BookType),
      //define resolve function to book info for the author
      resolve: (author) => {
        //filter list of books to get book whose author id matches author.id
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const CharacterType = new GraphQLObjectType({
  name: 'Character',
  description: 'A character in a book.',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    houseId: { type: GraphQLNonNull(GraphQLInt) },
    house: {
      type: HouseType,
      resolve: (character) => {
        return houses.find(house => house.id === character.houseId);
      }
    }
  })
})

const HouseType = new GraphQLObjectType({
  name: 'House',
  description: 'A Hogwarts house.',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    charactersInHouse: {
      type: GraphQLList(CharacterType),
      resolve: (house) => {
        return characters.filter(character => character.houseId === house.id);
      }
    }
  })
})

//initialize root query-what everything pulls down from  
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  //fields associated with RootQuery Type
  fields: () => ({
    book: {
      //type of the books field, a list of BookType
      type: BookType,
      description: 'single book',
      args: {
        id: { type: GraphQLInt }
      },
      //resolve function, retrieves list of books
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    //book field
    books: {
      //type of the books field, a list of BookType
      type: new GraphQLList(BookType),
      description: 'List of books',
      //resolve function, retrieves list of books
      resolve: () => books
    },
    author: {
      //type of the books field, a list of BookType
      type: AuthorType,
      description: 'single authors',
      args: {
        id: { type: GraphQLInt }
      },
      //resolve function, retrieves list of books
      resolve: (author, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      //type of the books field, a list of BookType
      type: new GraphQLList(AuthorType),
      description: 'List of authors',
      //resolve function, retrieves list of books
      resolve: () => authors
    },
    characters: {
      type: new GraphQLList(CharacterType),
      description: 'List of characters',
      resolve: () => characters
    },
    character: {
      type: CharacterType,
      description: 'Single character.',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => characters.find(character => character.id === args.id)
    },
    houses: {
      type: GraphQLList(HouseType),
      description: 'List of houses',
      resolve: () => houses
    },
    house: {
      type: HouseType,
      description: 'Single house.',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => houses.find(house => house.id === args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: BookType,
      description: 'add a author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

// ** TRY ANOTHER APP USE HERE WITH JUST MIDDLEWARE
// app.use(qevlarSecurity.staticQA);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  // graphiql: true,
}))

app.listen(3000, () => console.log('server running on 3000...'));