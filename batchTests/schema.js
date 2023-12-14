const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const db = require('./_db.js');
// import db from './_db.js';
//create GraphQL schema here
// console.log('food', db.foods);
// console.log('cat', db.categories);
// console.log('chefs', db.chefs);

// //create type for each array of objects
const FoodType = new GraphQLObjectType({
  //name
  name: 'Food',
  //description
  description: 'this will be a food',
  //fields-keys in object
  fields: () => ({
    //id
    id: { type: new GraphQLNonNull(GraphQLInt) },
    //title
    title: { type: new GraphQLNonNull(GraphQLString) },
    //categoryId
    categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    //img
    img: { type: new GraphQLNonNull(GraphQLString) },
    //ingredients
    ingredients: { type: new GraphQLNonNull(GraphQLString) },
    //chefId
    chefId: { type: new GraphQLNonNull(GraphQLInt) },

    // //get chef
    chef: {
      //type
      type: ChefType,
      resolve: (food) => {
        console.log('food', food);
        return db.chefs.find((cooks) => {
          // cooks.id === chef.chefId
          console.log('cooks', cooks);
        });
      },
    },
    // get category
    category: {
      //type
      type: CategoryType,
      //resolver
      resolve: (cat) => {
        return db.categories.find((category) => category.id === cat.categoryId);
      },
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  //name
  name: 'Categories',
  //description
  description: 'Meal categories',
  //fields
  fields: () => ({
    //id
    id: { type: new GraphQLNonNull(GraphQLInt) },
    //meal
    meal: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ChefType = new GraphQLObjectType({
  //name
  name: 'Chefs',
  //description
  description: 'Cooks of the meals',
  //fields
  fields: () => ({
    //id
    id: { type: new GraphQLNonNull(GraphQLInt) },
    //name
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

//root query type
const RootQueryType = new GraphQLObjectType({
  //name
  name: 'Query',
  //description
  description: 'Root Query',
  //fields
  fields: () => ({
    //meal field
    meal: {
      //type- mealType
      type: FoodType,
      //description
      description: 'A single meal',
      //args
      args: {
        id: { type: GraphQLInt },
      },
      //resolver
      resolve: (parent, args) => db.foods.find((food) => food.id === args.id),
    },
    meals: {
      //type- mealType
      type: new GraphQLList(FoodType),
      //description
      description: 'List of all Meals',
      //args
      //resolver
      resolve: () => db.foods,
    },
    chefs: {
      //type- mealType
      type: new GraphQLList(ChefType),
      //description
      description: 'List of all Chefs',
      //args
      //resolver
      resolve: () => db.chefs,
    },
    chef: {
      //type-
      type: ChefType,
      //description
      description: 'one chef',
      //args
      args: {
        //id
        id: { type: GraphQLInt },
      },
      //resolver
      resolve: (parent, args) => db.chefs.find((cook) => cook.id === args.id),
    },
    categories: {
      //type-
      type: new GraphQLList(CategoryType),
      //description
      description: 'list of all da categories',
      //args
      //resolver
      resolve: () => db.categories,
    },
    category: {
      //type-
      type: CategoryType,
      //description
      description: 'Single category',
      //args
      args: {
        id: { type: GraphQLInt },
      },
      //resolver
      resolve: (parent, args) =>
        db.categories.find((cat) => cat.id === args.id),
    },
  }),
});

//schema
const schema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = schema;
