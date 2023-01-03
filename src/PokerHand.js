/* eslint-disable no-unused-vars */
import { isValidHand, getScore } from './helper.js'

export function PokerHand(string) {
  if (string !== undefined && string !== '') {
    const cardsSplit = string.split(/\s/g)
    if (cardsSplit.length !== 5) {
      throw new Error(
        `${
          cardsSplit.length > 5 ? 'Too many' : 'Too few'
        } cards in param. You must pass 5 cards. For example : new PokerHand("KS 2H 5C JD TD")`
      )
    } else {
      this.cards = []
      //We check all cards are different
      for (let i = 0; i < cardsSplit.length; i++) {
        for (let j = 0; j < cardsSplit.length; j++) {
          if (i !== j) {
            if (cardsSplit[i] === cardsSplit[j]) {
              throw new Error(
                `At least two cards are the same : ${cardsSplit[i]}.`
              )
            }
          }
        }
      }
      for (let card of cardsSplit) {
        this.cards.push(getCardFromString(card))
      }
    }
  } else {
    //No string found, we generate a new random hand
    throw new Error(
      'No string found, provide one with 5 cards. For example : new PokerHand("KS 2H 5C JD TD").'
    )
  }
}

function getCardFromString(string) {
  //console.log(string)
  if (string.length === 2) {
    const value = getCardValue(string[0])
    const suit = getCardSuit(string[1])
    return { value, suit }
  } else {
    throw new Error(
      'Card format not correct. You must describe the card in 2 characters. The first is for the value (`2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `T`(en), `J`(ack), `Q`(ueen), `K`(ing), `A`(ce)), and the second is for the suit (`S`(pades), `H`(earts), `D`(iamonds), `C`(lubs)). For example : TD is for Ten-Diamond.'
    )
  }
}

function getCardValue(value) {
  if (
    ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].indexOf(
      value
    ) > -1
  ) {
    switch (value) {
      case 'A':
        return 12
      case 'K':
        return 11
      case 'Q':
        return 10
      case 'J':
        return 9
      case 'T':
        return 8
      default:
        return parseInt(value) - 2
    }
  } else {
    throw new Error(
      `Card value is not 'A','K','Q','J','T','9','8','7','6','5','4','3' or '2'.`
    )
  }
}

function getCardSuit(suit) {
  switch (suit) {
    case 'H':
      return 3
    case 'D':
      return 2
    case 'S':
      return 1
    case 'C':
      return 0
    default:
      throw new Error(`Card suit value is not 'H', 'D', 'S' or 'C'.`)
  }
}

PokerHand.prototype.compareWith = function (hand) {
  if (isValidHand(hand)) {
    if (isValidHand(this)) {
      //We compare the cards by allowing them a score
      const scoreThis = getScore(this),
        scoreCompared = getScore(hand)
      if (scoreThis.score > scoreCompared.score) {
        return 1
      } else if (scoreThis.score < scoreCompared.score) {
        return 2
      } else {
        if (scoreThis.score === 10) {
          return 3
        }
        //same score, we compare the cards (in case of Straight Flush, Four of kind, Full House, Flush, Straight, Three of Kind, 2 Pairs, Pair, and High Card)
        else if (scoreThis.score === 9 || scoreThis === 5) {
          //Straight (Flush)
          if (scoreThis.cards[4].value > scoreCompared.cards[4].value) {
            return 1
          } else if (scoreThis.cards[4].value < scoreCompared.cards[4].value) {
            return 2
          } else {
            return 3
          }
        } else if (scoreThis.score === 8) {
          //Four of Kind
          if (scoreThis.fourOf > scoreCompared.fourOf) {
            return 1
          } else if (scoreThis.fourOf < scoreCompared.fourOf) {
            return 2
          } else {
            if (scoreThis.otherCard.value > scoreCompared.otherCard.value) {
              return 1
            } else if (
              scoreThis.otherCard.value < scoreCompared.otherCard.value
            ) {
              return 2
            } else {
              return 3
            }
          }
        } else if (scoreCompared.score === 7) {
          //Full House
          if (scoreThis.threeOf > scoreCompared.threeOf) {
            return 1
          } else if (scoreThis.threeOf < scoreCompared.threeOf) {
            return 2
          } else {
            if (scoreThis.twoOf > scoreCompared.twoOf) {
              return 1
            } else if (scoreThis.twoOf < scoreCompared.twoOf) {
              return 2
            } else {
              return 3
            }
          }
        } else if (scoreThis.score === 6) {
          //Flush
          for (let i = 4; i >= 0; i--) {
            if (scoreThis.cards[i].value > scoreCompared.cards[i].value) {
              return 1
            } else if (
              scoreThis.cards[i].value < scoreCompared.cards[i].value
            ) {
              return 2
            }
          }
          return 3
        } else if (scoreThis.score === 4) {
          //Three of Kind
          if (scoreThis.threeOf > scoreCompared.threeOf) {
            return 1
          } else if (scoreThis.threeOf < scoreCompared.threeOf) {
            return 2
          } else {
            for (let i = 4; i >= 0; i--) {
              if (scoreThis.cards[i].value > scoreCompared.cards[i].value) {
                return 1
              } else if (
                scoreThis.cards[i].value < scoreCompared.cards[i].value
              ) {
                return 2
              }
            }
            return 3
          }
        } else if (scoreThis.score === 3) {
          //Two Pairs
          if (scoreThis.firstOf > scoreCompared.firstOf) {
            return 1
          } else if (scoreThis.firstOf < scoreCompared.firstOf) {
            return 2
          } else {
            if (scoreThis.secondOf > scoreCompared.secondOf) {
              return 1
            } else if (scoreThis.secondOf < scoreCompared.secondOf) {
              return 2
            } else {
              for (let i = 4; i >= 0; i--) {
                if (scoreThis.cards[i].value > scoreCompared.cards[i].value) {
                  return 1
                } else if (
                  scoreThis.cards[i].value < scoreCompared.cards[i].value
                ) {
                  return 2
                }
              }
              return 3
            }
          }
        } else if (scoreThis.score === 2) {
          //Pair
          if (scoreThis.pairOf > scoreCompared.pairOf) {
            return 1
          } else if (scoreThis.pairOf < scoreCompared.pairOf) {
            return 2
          } else {
            for (let i = 4; i >= 0; i--) {
              if (scoreThis.cards[i].value > scoreCompared.cards[i].value) {
                return 1
              } else if (
                scoreThis.cards[i].value < scoreCompared.cards[i].value
              ) {
                return 2
              }
            }
            return 3
          }
        } else {
          //High Card
          for (let i = 4; i >= 0; i--) {
            if (scoreThis.cards[i].value > scoreCompared.cards[i].value) {
              return 1
            } else if (
              scoreThis.cards[i].value < scoreCompared.cards[i].value
            ) {
              return 2
            }
          }
          return 3
        }
      }
    } else {
      //We should never come here because we construct PokerHand object
      throw new Error(
        'the actual object is not a valid hand (no 5 valid cards)'
      )
    }
  } else {
    throw new Error(
      'the compared hand passed as param is not a valid hand (no 5 valid cards)'
    )
  }
}
