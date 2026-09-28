import { ImageSourcePropType } from 'react-native';

export const categories = [
  'Starters',
  'Main Courses',
  'Desserts',
  'Drinks',
] as const;
export type Category = (typeof categories)[number];
export type Dish = {
  id: string;
  category: Category;
  name: string;
  price: number;
  ingredients: string;
  minutes: number;
  image: ImageSourcePropType;
};
export const dishes: Dish[] = [
  {
    id: 'TruffleBurrata',
    category: 'Starters',
    name: 'Truffle Burrata',
    price: 16,
    ingredients:
      'Burrata, heirloom tomatoes, truffle shavings, basil, extra virgin olive oil',
    minutes: 10,
    image: require('../assets/menu-truffle-burrata.png'),
  },
  {
    id: 'TunaTartare',
    category: 'Starters',
    name: 'Tuna Tartare',
    price: 18,
    ingredients:
      'Fresh tuna, avocado, sesame, spring onion, soy dressing, microgreens',
    minutes: 15,
    image: require('../assets/menu-tuna-tartare.png'),
  },
  {
    id: 'CrispyCalamari',
    category: 'Starters',
    name: 'Crispy Calamari',
    price: 15,
    ingredients: 'Calamari, crispy coating, lemon, herbs, aioli sauce',
    minutes: 12,
    image: require('../assets/menu-crispy-calamari.png'),
  },
  {
    id: 'BeefCarpaccio',
    category: 'Starters',
    name: 'Beef Carpaccio',
    price: 17,
    ingredients:
      'Thinly sliced beef fillet, parmesan, arugula, capers, truffle oil',
    minutes: 10,
    image: require('../assets/menu-beef-carpaccio.png'),
  },
  {
    id: 'LobsterBisque',
    category: 'Starters',
    name: 'Lobster Bisque',
    price: 19,
    ingredients: 'Lobster, cream, seafood stock, tomato, herbs',
    minutes: 20,
    image: require('../assets/menu-lobster-bisque.png'),
  },
  {
    id: 'FoieGrasTerrine',
    category: 'Starters',
    name: 'Foie Gras Terrine',
    price: 21,
    ingredients: 'Foie gras, fig, toasted brioche, berry sauce, sea salt',
    minutes: 18,
    image: require('../assets/menu-foie-gras-terrine.png'),
  },
  {
    id: 'FiletMignon',
    category: 'Main Courses',
    name: 'Filet Mignon',
    price: 34,
    ingredients:
      'Beef tenderloin, potato pur\u00e9e, roasted vegetables, red wine reduction',
    minutes: 25,
    image: require('../assets/menu-filet-mignon.png'),
  },
  {
    id: 'TruffleRisotto',
    category: 'Main Courses',
    name: 'Truffle Risotto',
    price: 24,
    ingredients:
      'Arborio rice, wild mushrooms, parmesan, truffle oil, fresh herbs',
    minutes: 22,
    image: require('../assets/menu-truffle-risotto.png'),
  },
  {
    id: 'GrilledSeaBass',
    category: 'Main Courses',
    name: 'Grilled Sea Bass',
    price: 27,
    ingredients: 'Sea bass fillet, asparagus, lemon beurre blanc, microgreens',
    minutes: 20,
    image: require('../assets/menu-grilled-sea-bass.png'),
  },
  {
    id: 'DuckBreast',
    category: 'Main Courses',
    name: 'Duck Breast',
    price: 29,
    ingredients:
      'Duck breast, cherry sauce, roasted vegetables, creamy pur\u00e9e',
    minutes: 25,
    image: require('../assets/menu-duck-breast.png'),
  },
  {
    id: 'LobsterPasta',
    category: 'Main Courses',
    name: 'Lobster Pasta',
    price: 32,
    ingredients:
      'Lobster, fresh pasta, creamy sauce, cherry tomatoes, garlic, herbs',
    minutes: 25,
    image: require('../assets/menu-lobster-pasta.png'),
  },
  {
    id: 'HerbCrustedLamb',
    category: 'Main Courses',
    name: 'Herb Crusted Lamb',
    price: 31,
    ingredients: 'Lamb rack, herb crust, roasted root vegetables, rosemary jus',
    minutes: 30,
    image: require('../assets/menu-herb-crusted-lamb.png'),
  },
  {
    id: 'ChocolateFondant',
    category: 'Desserts',
    name: 'Chocolate Fondant',
    price: 12,
    ingredients:
      'Dark chocolate, butter, eggs, flour, vanilla ice cream, cocoa',
    minutes: 15,
    image: require('../assets/menu-chocolate-fondant.png'),
  },
  {
    id: 'PistachioTiramisu',
    category: 'Desserts',
    name: 'Pistachio Tiramisu',
    price: 11,
    ingredients: 'Mascarpone, pistachio cream, espresso, ladyfingers, cocoa',
    minutes: 12,
    image: require('../assets/menu-pistachio-tiramisu.png'),
  },
  {
    id: 'CremeBrulee',
    category: 'Desserts',
    name: 'Cr\u00e8me Br\u00fbl\u00e9e',
    price: 10,
    ingredients: 'Cream, egg yolks, vanilla, caramelized sugar, fresh berries',
    minutes: 15,
    image: require('../assets/menu-creme-brulee.png'),
  },
  {
    id: 'BerryCheesecake',
    category: 'Desserts',
    name: 'Berry Cheesecake',
    price: 11,
    ingredients: 'Cream cheese, biscuit base, mixed berries, berry glaze',
    minutes: 15,
    image: require('../assets/menu-berry-cheesecake.png'),
  },
  {
    id: 'LemonTart',
    category: 'Desserts',
    name: 'Lemon Tart',
    price: 10,
    ingredients: 'Lemon cream, buttery pastry, meringue, citrus zest',
    minutes: 18,
    image: require('../assets/menu-lemon-tart.png'),
  },
  {
    id: 'VanillaPannaCotta',
    category: 'Desserts',
    name: 'Vanilla Panna Cotta',
    price: 10,
    ingredients: 'Cream, vanilla, berry coulis, fresh berries, mint',
    minutes: 12,
    image: require('../assets/menu-vanilla-panna-cotta.png'),
  },
  {
    id: 'SignatureOldFashioned',
    category: 'Drinks',
    name: 'Signature Old Fashioned',
    price: 14,
    ingredients: 'Bourbon whiskey, bitters, orange peel, brown sugar, ice',
    minutes: 5,
    image: require('../assets/menu-signature-old-fashioned.png'),
  },
  {
    id: 'RaspberryMartini',
    category: 'Drinks',
    name: 'Raspberry Martini',
    price: 13,
    ingredients: 'Vodka, raspberry syrup, lemon juice, fresh raspberries',
    minutes: 5,
    image: require('../assets/menu-raspberry-martini.png'),
  },
  {
    id: 'CitrusSpritz',
    category: 'Drinks',
    name: 'Citrus Spritz',
    price: 12,
    ingredients: 'Prosecco, orange liqueur, soda, orange, grapefruit',
    minutes: 5,
    image: require('../assets/menu-citrus-spritz.png'),
  },
  {
    id: 'PremiumRedWine',
    category: 'Drinks',
    name: 'Premium Red Wine',
    price: 15,
    ingredients: 'Selected red wine, served by the glass',
    minutes: 2,
    image: require('../assets/menu-premium-red-wine.png'),
  },
  {
    id: 'SparklingChampagne',
    category: 'Drinks',
    name: 'Sparkling Champagne',
    price: 18,
    ingredients: 'Premium champagne, served chilled',
    minutes: 2,
    image: require('../assets/menu-sparkling-champagne.png'),
  },
  {
    id: 'TruffleEspresso',
    category: 'Drinks',
    name: 'Truffle Espresso',
    price: 9,
    ingredients:
      'Espresso, coffee crema, truffle aroma, dark chocolate garnish',
    minutes: 5,
    image: require('../assets/menu-truffle-espresso.png'),
  },
];
export const restaurantDescription =
  'Rama restaurant offers a refined dining experience in an elegant and atmospheric setting. The menu combines modern culinary techniques with carefully selected ingredients and beautifully presented dishes. Guests can enjoy signature meals, crafted drinks, seasonal specials, and attentive service throughout their visit. Whether you are joining us for a casual dinner, a celebration, or an evening out, every detail is designed to make your experience memorable.';
export const chefDescription =
  'Our chef brings creativity, precision, and a passion for contemporary cuisine to every dish. Her cooking combines refined presentation with rich flavors and carefully balanced ingredients. Inspired by seasonal products and modern culinary traditions, she creates a menu that feels both elegant and inviting. Guests can also discover her approach to cooking through exclusive chef-led masterclasses.';
