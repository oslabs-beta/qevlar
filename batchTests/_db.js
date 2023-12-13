//mock db
const foods = [
  {
    id: '1',
    title: 'rigatoni alla zaza',
    categoryId: '1',
    img: 'src/food/rigatoni.png',
    ingredients: ['pancetta'],
    chefId: '1',
  },
  {
    id: '2',
    title: 'fish tacos',
    categoryId: '1',
    img: 'src/food/ftacos.png',
    ingredients: [
      'tilapia',
      'small tortillas',
      'pico de gallo',
      'small milk',
      'shredded red and green cabbage',
      'chipotle peppers sauce thin',
      'sour cream',
    ],
    chefId: '2',
  },
  {
    id: '3',
    title: 'Shrimp cumin ginger',
    categoryId: '1',
    img: 'src/food/gshrimp.png',
    ingredients: ['shrimp', 'ginger', 'cumin', 'lime', 'cilantro'],
    chefId: '2',
  },
  {
    id: '4',
    title: 'Frozen Pizza',
    categoryId: '1',
    img: 'src/food/fpizza.jpg',
    ingredients: ['given up, have we?'],
    chefId: '1',
  },
  {
    id: '5',
    title: 'Corned Beef Hash',
    categoryId: '3',
    img: 'src/food/chash.jpg',
    ingredients: ['Yellow onion', '2 small potatoes', 'egg', 'corned beef'],
    chefId: '1',
  },
  {
    id: '6',
    title: 'Black Pepper Beef and Cabbage Stir Fry',
    categoryId: '1',
    img: 'src/food/trimBeef.png',
    ingredients: [
      'shaved steak',
      'garlic',
      'brown sugar',
      'green cabbage',
      'scallions',
      'cornstarch',
      'sherry vinegar',
    ],
    chefId: '1',
  },
  {
    id: '7',
    title: 'Carne Asada',
    categoryId: '1',
    img: 'src/food/carneAsada.png',
    ingredients: ['Carne asada', 'gold potatoes'],
    chefId: 2,
  },
  {
    id: '8',
    title: 'Chicken Quesadilla',
    categoryId: '2',
    img: 'src/food/chickenquesa.png',
    ingredients: ['grilled chicken', 'big tortillas', 'shredded ched'],
    chefId: '1',
  },
  {
    id: '9',
    title: 'Hard Boiled Eggs',
    categoryId: '3',
    img: 'src/food/harboilEgg.png',
    ingredients: ['egg'],
    chefId: '1',
  },
  {
    id: '10',
    title: 'Veggie Burritos',
    categoryId: '1',
    img: 'src/food/vburritos.png',
    ingredients: [
      'big tortillas',
      'red onion',
      'greens',
      'bell pepper',
      'cheese',
    ],
    chefId: '2',
  },
  {
    id: '11',
    title: 'Overnight Oats',
    categoryId: '3',
    img: 'src/food/oOats.png',
    ingredients: [
      'oats',
      'chia seeds',
      'frozen berry blend',
      'peanut butter',
      'oat milk',
    ],
    chefId: '2',
  },
];
const categories = [
  { id: '1', meal: 'Dinner' },
  { id: '2', meal: 'Lunch' },
  { id: '3', meal: 'Breakfast' },
];

const chefs = [
  {
    id: '1',
    name: 'Conor',
  },
  {
    id: '2',
    name: 'Melissa',
  },
];

module.exports = { chefs, categories, foods };
