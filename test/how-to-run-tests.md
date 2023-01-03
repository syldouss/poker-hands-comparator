## How to run tests

1. Install package dependencies running `npm i`
2. Run tests with command `npm test`

## What contains the /src folder

- The [`/src/PokerHand.js`](../src//PokerHand.js) file contains function to create poker hand objects from string parameter and `compareWith` function to compare a hand to another. I have implemented an error management (at least error thrown) in certain use cases (more or less than 5 cards in a hand, card value or suit not expected, etc.)

- The [`/src/helper.js`](../src/helper.js) file contains helper functions used by the main entry file [`/src/PokerHand.js`](../src//PokerHand.js). You can find in that file the `getScore` function used by `compareWith` function to calculate the score of a hand in order to compare it to another hand score. You will also find here the `isValidHand` function that throws error if the given hand is not a valid poker hand (more or less than 5 cards, card value or suit not expected...).

## What contains the /test folder

Tests are developed using mocha and chai packages. I tried to add unit tests to all implemented functions. I say try because it's possible I forgot something.. I also tested the errors.

- The [`/test/PokerHand.test.js`](PokerHand.test.js) file contains unit tests that cover functions contained in [`/src/PokerHand.js`](../src//PokerHand.js) file.

- The [`/test/helper.test.js`](helper.test.js) file contains unit tests that cover functions contained in [`/src/helper.js`](../src/helper.js) file.
