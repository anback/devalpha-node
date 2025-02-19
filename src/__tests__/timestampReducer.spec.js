// eslint-disable-next-line header/header
import { INITIALIZED } from '../'
import { timestampReducer as reducer } from '../lib/reducers/timestampReducer'

it('return the initial state', () => {
  const actual = reducer(undefined, {
    type: INITIALIZED,
    payload: {
      timestamp: 0
    }
  })
  const expected = 0
  expect(actual).toBe(expected)
})

it('update timestamp if valid value in payload', () => {
  const actual = reducer(50, {
    type: 'FOO',
    payload: {
      timestamp: 100
    }
  })
  const expected = 100
  expect(actual).toBe(expected)
})

it('state remains unchanged if missing timestamp', () => {
  // @ts-ignore
  const actual = reducer(50, {
    type: 'FOO',
    payload: {}
  })
  const expected = 50
  expect(actual).toBe(expected)
})
