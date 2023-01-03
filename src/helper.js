export function getSuitLabel(suit) {
  switch (suit) {
    case 3:
      return 'Heart'
    case 2:
      return 'Diamond'
    case 1:
      return 'Spade'
    default:
      return 'Club'
  }
}

export function isValidHand(hand) {
  if (Array.isArray(hand.cards) && hand.cards.length === 5) {
    const theCards = []
    for (let card of hand.cards) {
      if (
        !(
          card.value >= 0 &&
          card.value <= 12 &&
          card.suit >= 0 &&
          card.suit <= 3
        )
      ) {
        return false
      } else {
        if (
          theCards.findIndex(
            (c) => c.value === card.value && c.suit === card.suit
          ) === -1
        ) {
          theCards.push(card)
        } else {
          return false
        }
      }
    }
    return true
  } else {
    return false
  }
}

export function getScore(hand) {
  if (isValidHand(hand)) {
    let flush = false
    if (hand.cards.filter((c) => c.suit === hand.cards[0].suit).length === 5) {
      flush = true
    }

    //All cards with the same suit
    //We sort cards
    hand.cards.sort((a, b) => a.value - b.value)

    //We look if we have a straight
    let straight = true
    for (let i = 1; i < hand.cards.length; i++) {
      if (!(hand.cards[i].value === hand.cards[i - 1].value + 1)) {
        straight = false
        break
      }
    }

    if (flush && straight) {
      if (hand.cards[4].value === 12) {
        //Royal flush
        return {
          score: 10,
          label: 'Royal Flush',
          suit: getSuitLabel(hand.cards[0].suit),
          highestCard: 12,
          cards: hand.cards,
        }
      } else {
        //Straight Flush
        return {
          score: 9,
          label: 'Straight Flush',
          suit: getSuitLabel(hand.cards[0].suit),
          cards: hand.cards,
        }
      }
    } else if (flush) {
      return {
        score: 6,
        label: 'Flush',
        suit: getSuitLabel(hand.cards[0].suit),
        cards: hand.cards,
      }
    } else if (straight) {
      return {
        score: 5,
        label: 'Straight',
        cards: hand.cards,
      }
    }

    //We compare cards value
    const sameValue = []
    let currentNbSameValue = 1
    for (let i = 1; i < hand.cards.length; i++) {
      if (hand.cards[i].value === hand.cards[i - 1].value) {
        currentNbSameValue++
        if (i === 4) {
          sameValue.push(currentNbSameValue)
        }
      } else {
        sameValue.push(currentNbSameValue)
        currentNbSameValue = 1
        if (i === 4) {
          sameValue.push(currentNbSameValue)
        }
      }
    }
    let fourOfKind = false,
      threeOfKind = false,
      pair = false,
      twoPairs = false
    if (sameValue.indexOf(4) > -1) {
      fourOfKind = true
    }
    if (sameValue.indexOf(3) > -1) {
      threeOfKind = true
    }
    if (sameValue.indexOf(2) > -1) {
      pair = true
      if (sameValue.filter((v) => v === 2).length === 2) {
        twoPairs = true
      }
    }

    if (fourOfKind) {
      return {
        score: 8,
        label: 'Four of Kind',
        cards: hand.cards,
        fourOf: hand.cards[sameValue.indexOf(4) === 0 ? 0 : 1].value,
        otherCard: hand.cards.filter((c, index) =>
          sameValue.indexOf(1) === 0 ? index === 0 : index === 4
        )[0],
      }
    }
    if (threeOfKind) {
      if (pair) {
        return {
          score: 7,
          label: 'Full House',
          cards: hand.cards,
          threeOf: hand.cards[sameValue.indexOf(3) === 0 ? 0 : 2].value,
          twoOf: hand.cards[sameValue.indexOf(2) === 0 ? 0 : 3].value,
        }
      } else {
        return {
          score: 4,
          label: 'Three of Kind',
          cards: hand.cards,
          threeOf:
            hand.cards[
              sameValue.indexOf(3) === 0
                ? 0
                : sameValue.indexOf(3) === 1
                ? 1
                : 2
            ].value,
        }
      }
    }
    if (twoPairs) {
      return {
        score: 3,
        label: 'Two Pairs',
        cards: hand.cards,
        firstOf: hand.cards[sameValue.lastIndexOf(2) === 1 ? 2 : 3].value,
        secondOf: hand.cards[sameValue.indexOf(2) === 0 ? 0 : 1].value,
      }
    }
    if (pair) {
      return {
        score: 2,
        label: 'Pair',
        cards: hand.cards,
        pairOf: hand.cards[sameValue.indexOf(2)].value,
      }
    }

    return {
      score: 1,
      label: 'High Card',
      cards: hand.cards,
      highestCard: hand.cards[4].value,
    }
  } else {
    throw new Error('Hand not valid')
  }
}
