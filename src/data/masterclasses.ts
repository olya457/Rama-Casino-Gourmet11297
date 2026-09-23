import { ImageSourcePropType } from 'react-native';

export type Masterclass = {
  id: string;
  name: string;
  date: string;
  image: ImageSourcePropType;
  paragraphs: string[];
};
export const masterclasses: Masterclass[] = [
  {
    id: 'steak',
    name: 'Perfect Steak Masterclass',
    date: '2026-10-04T18:00:00',
    image: require('../assets/masterclass-perfect-steak-masterclass.png'),
    paragraphs: [
      'Learn how to choose, season, and cook the perfect steak at home. The chef will demonstrate professional techniques for creating a golden crust while keeping the center tender and juicy. Guests will also discover how resting time and temperature affect the final result.',
      'The masterclass includes a practical cooking session and a guided tasting. Participants will work with premium cuts of beef and learn how to pair them with sauces and side dishes. The evening ends with a shared dinner and the chef’s personal recommendations.',
    ],
  },
  {
    id: 'pasta',
    name: 'Truffle Pasta Workshop',
    date: '2026-10-11T17:30:00',
    image: require('../assets/masterclass-truffle-pasta-workshop.png'),
    paragraphs: [
      'Discover the secrets behind fresh pasta and rich truffle sauces. The chef will show how to prepare the dough, create the perfect texture, and combine it with delicate seasonal ingredients. Guests will prepare their own pasta dish under professional guidance.',
      'This intimate workshop is designed for both beginners and experienced home cooks. Each participant will learn how to balance cream, parmesan, herbs, and truffle flavors. The experience finishes with a tasting of the dishes prepared during the class.',
    ],
  },
  {
    id: 'dessert',
    name: 'Modern Dessert Atelier',
    date: '2026-10-18T16:00:00',
    image: require('../assets/masterclass-modern-dessert-atelier.png'),
    paragraphs: [
      'Explore the art of creating elegant restaurant-style desserts. The chef will demonstrate how to combine textures, colors, and flavors to create a balanced sweet course. Guests will learn techniques for preparing chocolate, cream, fruit sauces, and decorative elements.',
      'During the workshop, each participant will create a modern plated dessert. The chef will share practical tips about presentation and ingredient combinations. Guests will enjoy their creations together at the end of the session.',
    ],
  },
  {
    id: 'cocktail',
    name: 'Signature Cocktail Lab',
    date: '2026-10-25T19:00:00',
    image: require('../assets/masterclass-signature-cocktail-lab.png'),
    paragraphs: [
      'Learn how premium cocktails are created and balanced. The bartender will introduce the main techniques of mixing, shaking, stirring, and garnishing. Guests will work with fresh fruits, herbs, premium spirits, and house-made syrups.',
      'Each participant will prepare several cocktails inspired by the restaurant’s signature menu. The workshop also includes a short introduction to flavor pairing and glassware selection. Guests will finish the evening with a tasting of their own creations.',
    ],
  },
  {
    id: 'seafood',
    name: 'Seafood And Citrus',
    date: '2026-11-01T18:00:00',
    image: require('../assets/masterclass-seafood-and-citrus.png'),
    paragraphs: [
      'Discover how to prepare seafood with fresh and vibrant citrus flavors. The chef will demonstrate techniques for selecting, seasoning, and cooking fish and shellfish. Guests will learn how acidity, herbs, and spices can enhance delicate seafood dishes.',
      'The practical session includes the preparation of a refined seafood plate. Participants will explore combinations of lemon, orange, grapefruit, herbs, and light sauces. The workshop ends with a shared tasting and the chef’s serving recommendations.',
    ],
  },
  {
    id: 'plating',
    name: 'Fine Dining Plating',
    date: '2026-11-08T17:00:00',
    image: require('../assets/masterclass-fine-dining-plating.png'),
    paragraphs: [
      'Learn how professional chefs create visually balanced plates. The workshop focuses on composition, color, texture, portion size, and the placement of every ingredient. Guests will discover how a simple dish can become a sophisticated restaurant presentation.',
      'The chef will demonstrate several plating techniques and provide individual guidance. Participants will create their own plates using prepared ingredients and decorative elements. The class ends with a presentation review and a tasting of the finished dishes.',
    ],
  },
  {
    id: 'wine',
    name: 'Wine Pairing Experience',
    date: '2026-11-15T18:30:00',
    image: require('../assets/masterclass-wine-pairing-experience.png'),
    paragraphs: [
      'Explore the relationship between wine and food through a guided tasting experience. A restaurant expert will explain how sweetness, acidity, body, and aroma influence the perfect pairing. Guests will taste several wines alongside carefully selected dishes.',
      'The evening is designed for both wine beginners and experienced guests. Participants will learn how to identify their preferred wine styles and avoid common pairing mistakes. The experience includes practical recommendations for choosing wine at home or in a restaurant.',
    ],
  },
  {
    id: 'secrets',
    name: 'Secrets Of The Chef',
    date: '2026-11-22T18:00:00',
    image: require('../assets/masterclass-secrets-of-the-chef.png'),
    paragraphs: [
      'Join the chef for an intimate look behind the scenes of the restaurant kitchen. Guests will discover the creative process behind signature dishes, seasonal menus, and the selection of premium ingredients. The chef will share personal techniques and stories from her culinary journey.',
      'The masterclass combines live cooking, tasting, and open conversation. Participants will observe how a complete fine-dining dish is created from the first ingredient to the final presentation. The evening concludes with a special dinner prepared by the chef.',
    ],
  },
];
