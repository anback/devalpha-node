// @flow
import Decimal from 'decimal.js'
import {
  ORDER_PLACED,
  ORDER_FILLED,
  ORDER_CANCELLED,
  INITIALIZED
} from '../../constants'

const initialState = {}

/**
 * Reducer function for managing available open orders.
 *
 * @private
 * @param  {OrdersState =      initialState} state Current state.
 * @param  {StreamAction}    action An action received from the stream.
 * @return {OrdersState}           Next state.
 */
export function ordersReducer (state: OrdersState = initialState, action: StreamAction) {
  state = { ...state }

  switch (action.type) {
    case INITIALIZED: {
      const payload: DevAlphaOptions = (action.payload: any)
      if (payload.initialStates.orders) {
        const initial = payload.initialStates.orders
        state = { ...state, ...initial }
      }
      break
    }

    case ORDER_PLACED: {
      const order: ExecutedOrder = (action.payload: any)
      state[order.id] = order
      break
    }

    case ORDER_FILLED: {
      const payload = (action.payload: any)
      const order: ExecutedOrder = payload.filledOrder

      const storedOrder = state[order.id]

      if (storedOrder.quantity.eq(order.quantity)) {
        // Completely filled order
        delete state[order.id]
      } else if (
        // Sanity check to see if we receive more/less volume than we asked for
        (storedOrder.quantity.isPositive() && order.quantity.gt(storedOrder.quantity)) ||
        (storedOrder.quantity.isNegative() && order.quantity.lt(storedOrder.quantity))
      ) {
        const expected = storedOrder.quantity.toFixed(2)
        const actual = order.quantity.toFixed(2)
        throw new Error(`received order quantity ${actual} while expecting ${expected}`)
      } else {
        // Partially filled order
        const newQuantity = Decimal.sub(storedOrder.quantity, order.quantity)
        const newCommission = Decimal.sub(storedOrder.commission, order.commission)
        state[order.id] = {
          ...storedOrder,
          quantity: newQuantity,
          commission: newCommission
        }
      }
      break
    }

    case ORDER_CANCELLED: {
      const { id }: ExecutedOrder = (action.payload: any)
      delete state[id]
      break
    }

    default: {
      break
    }
  }

  return { ...state }
}
