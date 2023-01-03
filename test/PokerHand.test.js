/* eslint-disable no-undef */
import { expect } from 'chai'
import { PokerHand } from '../src/PokerHand.js'

describe('PokerHand construction tests', () => {
  it('should return an error if the given cards is empty or undefined', () => {
    let error = false
    try {
      new PokerHand('')
    } catch (e) {
      error = true
      expect(e.message).to.equal(
        `No string found, provide one with 5 cards. For example : new PokerHand("KS 2H 5C JD TD").`
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
    error = false
    try {
      new PokerHand()
    } catch (e) {
      error = true
      expect(e.message).to.equal(
        `No string found, provide one with 5 cards. For example : new PokerHand("KS 2H 5C JD TD").`
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return an Error if there are not 5 cards described in param string', () => {
    let error = false
    try {
      new PokerHand('KS 2H 5C JD')
    } catch (e) {
      error = true
      expect(e.message).to.be.equal(
        'Too few cards in param. You must pass 5 cards. For example : new PokerHand("KS 2H 5C JD TD")'
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }

    error = false
    try {
      new PokerHand('KS 2H 5C JD TS TH')
    } catch (e) {
      error = true
      expect(e.message).to.be.equal(
        'Too many cards in param. You must pass 5 cards. For example : new PokerHand("KS 2H 5C JD TD")'
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return an error if there is at least 2 same cards in the given hand', () => {
    let error = false
    try {
      new PokerHand('KS 2H 5C JD JD')
    } catch (e) {
      error = true
      expect(e.message).to.equal(`At least two cards are the same : JD.`)
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return an error if a card in the given hand does not feet the expected format (2 characters)', () => {
    let error = false
    try {
      new PokerHand('KS 2H 5C JD JDDD')
    } catch (e) {
      error = true
      expect(e.message).to.equal(
        'Card format not correct. You must describe the card in 2 characters. The first is for the value (`2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `T`(en), `J`(ack), `Q`(ueen), `K`(ing), `A`(ce)), and the second is for the suit (`S`(pades), `H`(earts), `D`(iamonds), `C`(lubs)). For example : TD is for Ten-Diamond.'
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return an error if the given cards have not the expected value', () => {
    let error = false
    try {
      new PokerHand('KS 2H 5C JD YD')
    } catch (e) {
      error = true
      expect(e.message).to.equal(
        `Card value is not 'A','K','Q','J','T','9','8','7','6','5','4','3' or '2'.`
      )
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return an error if the given cards have not the expected suit', () => {
    let error = false
    try {
      new PokerHand('KS 2H 5C JD TF')
    } catch (e) {
      error = true
      expect(e.message).to.equal(`Card suit value is not 'H', 'D', 'S' or 'C'.`)
    } finally {
      //We check an error has been thrown
      expect(error).to.be.true
    }
  })

  it('should return the given hand', () => {
    const hand = new PokerHand('KS 2H 5C JD TD')
    expect(hand.cards.length).to.equal(5)
    expect(hand.cards).to.deep.equal([
      {
        value: 11,
        suit: 1,
      },
      {
        value: 0,
        suit: 3,
      },
      {
        value: 3,
        suit: 0,
      },
      {
        value: 9,
        suit: 2,
      },
      {
        value: 8,
        suit: 2,
      },
    ])
  })
})

describe('test compareWith function', () => {
  it('should throw an error is the given param hand is not valid', () => {
    const hand = {
      cards: [
        { value: 0, suit: 0 },
        { value: 1, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
      ],
    }
    const theHand = new PokerHand('KS 2H 5C JD TD')

    let error = false
    try {
      expect(theHand.compareWith(hand))
    } catch (e) {
      error = true
      expect(e.message).to.equal(
        'the compared hand passed as param is not a valid hand (no 5 valid cards)'
      )
    } finally {
      expect(error).to.be.true
    }
  })

  it('case High Card', () => {
    let hand1 = new PokerHand('2S JC 3D 7H AH')
    let hand2 = new PokerHand('2S JC 3D 7H KH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 3D 7H AH')
    hand2 = new PokerHand('2S TC 3D 7H AH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 3D 8H AH')
    hand2 = new PokerHand('2S JC 3D 7H AH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 4D 7H AH')
    hand2 = new PokerHand('2S JC 3D 7H AH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('3S JC 4D 7H AH')
    hand2 = new PokerHand('2S JC 4D 7H AH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Pair', () => {
    let hand1 = new PokerHand('2S JC 2D 7H AH')
    let hand2 = new PokerHand('3S JC 3D 7H AH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 2D 7H AH')
    hand2 = new PokerHand('2S JC 2D 7H KH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Two Pairs', () => {
    let hand1 = new PokerHand('2S JC 2D JH AH')
    let hand2 = new PokerHand('3S JC 3D JH AH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 2D JH AH')
    hand2 = new PokerHand('2S QC 2D QH KH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S JC 2D JH AH')
    hand2 = new PokerHand('2S JC 2D JH KH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Three of Kind', () => {
    let hand1 = new PokerHand('2S 2C 2D JH AH')
    let hand2 = new PokerHand('3S 3C 3D JH AH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S 2C 2D JH AH')
    hand2 = new PokerHand('2S 2C 2D QH AH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('2S 2C 2D JH AH')
    hand2 = new PokerHand('2S 2C 2D JH KH')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Straight', () => {
    let hand1 = new PokerHand('3S 2C 5D 4H 6H')
    let hand2 = new PokerHand('3S 5C 6D 4H 7H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Flush', () => {
    let hand1 = new PokerHand('3S QS TS 4S 6S')
    let hand2 = new PokerHand('3H JH 6H 9H 7H')
    expect(hand1.compareWith(hand2)).to.equal(1)
    expect(hand2.compareWith(hand1)).to.equal(2)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('3S QS TS 4S 6S')
    hand2 = new PokerHand('3H JH 6H 9H QH')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Full House', () => {
    let hand1 = new PokerHand('3S 3C 5S 5C 3H')
    let hand2 = new PokerHand('3S 3H 7S 3C 7H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('3S 3C 5S 5C 3H')
    hand2 = new PokerHand('3S 3H 7S 7C 7H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Four of Kind', () => {
    let hand1 = new PokerHand('3S 3C 5S 3D 3H')
    let hand2 = new PokerHand('3S 7D 7S 7C 7H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
    hand1 = new PokerHand('3S 3C 5S 3D 3H')
    hand2 = new PokerHand('3S 3C KS 3D 3H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
  it('case Straight Flush', () => {
    let hand1 = new PokerHand('3S 2S 5S 4S 6S')
    let hand2 = new PokerHand('3H 5H 6H 4H 7H')
    expect(hand1.compareWith(hand2)).to.equal(2)
    expect(hand2.compareWith(hand1)).to.equal(1)
    expect(hand2.compareWith(hand2)).to.equal(3)
  })
})
