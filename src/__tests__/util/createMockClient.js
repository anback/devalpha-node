// @flow
export const createMockClient = (fail: boolean = false) => {
  let orderIdCounter = 0
  return ({ onFill }: Object) => ({
    executeOrder: async (order: Order) => {
      orderIdCounter += 1
      const builtOrder = Object.assign({}, order, {
        commission: 0,
        id: orderIdCounter.toString()
      })
      /* simulate network delay */
      await new Promise(resolve => setTimeout(resolve, 10))
      if (fail) {
        throw new Error()
      } else {
        /* simulate market delay */
        setTimeout(() => {
          onFill(builtOrder)
        }, 200)
      }

      return Object.assign({}, builtOrder)
    },
    cancelOrder: async ({ id }: ExecutedOrder) => {
      /* simulate network delay */
      await new Promise(resolve => setTimeout(resolve, 10))
      if (fail) {
        throw new Error()
      } else {
        return id
      }
    },
    calculateCommission: () => 0
  })
}
