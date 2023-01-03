/* eslint-disable no-undef */
import { expect } from 'chai'
import { getScore, isValidHand } from '../src/helper.js'
import { PokerHand } from '../src/PokerHand.js'

describe('test isValidHand function', () => {
  it('should return false if the given object does not contain 5 elements in his cards prop', () => {
    const hand = { cards: [1, 2, 3, 4] }
    expect(isValidHand(hand)).to.be.false
    const hand2 = { cards: [1, 2, 3, 4, 5, 6] }
    expect(isValidHand(hand2)).to.be.false
  })

  it('should return false if the given cards are not well formatted (value between 0 and 12 and suit between 0 and 3)', () => {
    const hand = {
      cards: [
        { value: 0, suit: 0 },
        { value: 1, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
        { value: 14, suit: 0 },
      ],
    }
    expect(isValidHand(hand)).to.be.false
    const hand2 = {
      cards: [
        { value: 0, suit: 0 },
        { value: 1, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
        { value: 4, suit: 5 },
      ],
    }
    expect(isValidHand(hand2)).to.be.false
  })

  it('should return false if the given cards present the same card twice or more', () => {
    const hand = {
      cards: [
        { value: 0, suit: 0 },
        { value: 0, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
        { value: 4, suit: 0 },
      ],
    }
    expect(isValidHand(hand)).to.be.false
  })

  it('should return true if the given hand is valid', () => {
    const hand = {
      cards: [
        { value: 0, suit: 0 },
        { value: 1, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
        { value: 4, suit: 0 },
      ],
    }
    expect(isValidHand(hand)).to.be.true
  })
})

describe('test getScore function', () => {
  it('should throw an Error if the hand is not valid', () => {
    const hand = {
      cards: [
        {
          value: 0,
          suit: 0,
        },
        {
          value: 0,
          suit: 0,
        },
        {
          value: 0,
          suit: 0,
        },
        {
          value: 0,
          suit: 0,
        },
        {
          value: 0,
          suit: 0,
        },
      ],
    }

    let error = false
    try {
      getScore(hand)
    } catch (e) {
      error = true
      expect(e.message).to.equal('Hand not valid')
    } finally {
      expect(error).to.be.true
    }

    error = false
    const hand2 = {
      cards: [
        { value: 0, suit: 0 },
        { value: 1, suit: 0 },
        { value: 2, suit: 0 },
        { value: 3, suit: 0 },
      ],
    }
    try {
      getScore(hand2)
    } catch (e) {
      error = true
      expect(e.message).to.equal('Hand not valid')
    } finally {
      expect(error).to.be.true
    }
  })

  it('should return a Royal Flush with "QS JS AS TS KS"', () => {
    const hand = new PokerHand('QS JS AS TS KS')
    expect(getScore(hand)).to.deep.equal({
      score: 10,
      label: 'Royal Flush',
      suit: 'Spade',
      highestCard: 12,
      cards: [
        {
          value: 8,
          suit: 1,
        },
        {
          value: 9,
          suit: 1,
        },
        {
          value: 10,
          suit: 1,
        },
        {
          value: 11,
          suit: 1,
        },
        {
          value: 12,
          suit: 1,
        },
      ],
    })
  })
  it('should return a Straight Flush with "QS JS 9S TS KS"', () => {
    const hand = new PokerHand('QS JS 9S TS KS')
    expect(getScore(hand)).to.deep.equal({
      score: 9,
      label: 'Straight Flush',
      suit: 'Spade',
      cards: [
        {
          value: 7,
          suit: 1,
        },
        {
          value: 8,
          suit: 1,
        },
        {
          value: 9,
          suit: 1,
        },
        {
          value: 10,
          suit: 1,
        },
        {
          value: 11,
          suit: 1,
        },
      ],
    })
  })
  it('should return a Four of Kind with "QS QH QC TS QD"', () => {
    const hand = new PokerHand('QS QH QC TS QD')
    const { score, label, otherCard, fourOf } = getScore(hand)
    expect(score).to.equal(8)
    expect(label).to.equal('Four of Kind')
    expect(otherCard).to.deep.equal({ value: 8, suit: 1 })
    expect(fourOf).to.equal(10)
  })
  it('should return a Full House with "QS 2H QC 2S 2D"', () => {
    const hand = new PokerHand('QS 2H QC 2S 2D')
    const { score, label, threeOf, twoOf } = getScore(hand)
    expect(score).to.equal(7)
    expect(label).to.equal('Full House')
    expect(threeOf).to.equal(0)
    expect(twoOf).to.equal(10)
  })
  it('should return a Flush with "QS 2S JS TS 3S"', () => {
    const hand = new PokerHand('QS 2S JS TS 3S')
    const { score, label, suit, cards } = getScore(hand)
    expect(score).to.equal(6)
    expect(label).to.equal('Flush')
    expect(suit).to.equal('Spade')
    expect(cards).to.deep.equal([
      {
        value: 0,
        suit: 1,
      },
      {
        value: 1,
        suit: 1,
      },
      {
        value: 8,
        suit: 1,
      },
      {
        value: 9,
        suit: 1,
      },
      {
        value: 10,
        suit: 1,
      },
    ])
  })
  it('should return a Straight with "QS 9H TC 8S 7D"', () => {
    const hand = new PokerHand('JS 9H TC 8S 7D')
    const { score, label, cards } = getScore(hand)
    expect(score).to.equal(5)
    expect(label).to.equal('Straight')
    expect(cards).to.deep.equal([
      {
        value: 5,
        suit: 2,
      },
      {
        value: 6,
        suit: 1,
      },
      {
        value: 7,
        suit: 3,
      },
      {
        value: 8,
        suit: 0,
      },
      {
        value: 9,
        suit: 1,
      },
    ])
  })
  it('should return a Three of Kind with "QS JH QC TS QD"', () => {
    const hand = new PokerHand('QS JH QC TS QD')
    const { score, label, threeOf } = getScore(hand)
    expect(score).to.equal(4)
    expect(label).to.equal('Three of Kind')
    expect(threeOf).to.equal(10)
  })
  it('should return a Two Pairs with "QS JH QC 2S JD"', () => {
    const hand = new PokerHand('QS JH QC 2S JD')
    const { score, label, firstOf, secondOf } = getScore(hand)
    expect(score).to.equal(3)
    expect(label).to.equal('Two Pairs')
    expect(firstOf).to.equal(10)
    expect(secondOf).to.equal(9)
  })
  it('should return a Pair with "QS JH QC 2S 3D"', () => {
    const hand = new PokerHand('QS JH QC 2S 3D')
    const { score, label, pairOf } = getScore(hand)
    expect(score).to.equal(2)
    expect(label).to.equal('Pair')
    expect(pairOf).to.equal(10)
  })
  it('should return a High Card with "QS JH 7C 2S 3D"', () => {
    const hand = new PokerHand('QS JH 7C 2S 3D')
    const { score, label, highestCard } = getScore(hand)
    expect(score).to.equal(1)
    expect(label).to.equal('High Card')
    expect(highestCard).to.equal(10)
  })
})
