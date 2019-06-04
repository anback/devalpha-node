// @flow
/* eslint-disable no-unused-vars */
import Decimal from 'decimal.js'
import type Highland from 'highland'

type TimestampState = number

type IBar = {
  timestamp: number,
  identifier: string,
  open: number | Decimal,
  high: number | Decimal,
  low: number | Decimal,
  close: number | Decimal
}

type Position = {
  quantity: Decimal,
  value: Decimal,
  price: Decimal
}

type PositionsState = {
  instruments: {
    [key: string]: Position
  },
  total: Decimal
}

type CapitalState = {
  cash: Decimal,
  commission: Decimal,
  reservedCash: Decimal,
  total: Decimal
}

type Feeds<R> = {
  [key: string]: Highland.Stream<R>
}

type FeedItem = {
  timestamp: number,
  [key: string]: any
}

type StreamAction = {
  type: string,
  payload: FeedItem
}

type GuardOptions = {
  shorting?: boolean,
  margin?: boolean,
  restricted?: string[]
}

type Store = {
  dispatch: Function,
  getState: Function,
  setState: Function
}

type Order = {
  identifier: string
}

type LimitOrder = Order & { price: number }

type QuantityOrder = Order & { quantity: number }
type PercentageOrder = Order & { percent: number }

type StopOrder = Order & { trigger: number }
type TrailingOrder = Order & { threshold: number }

type AutomatedOrder = StopOrder | TrailingOrder
type SizedOrder = PercentageOrder | QuantityOrder

type RequestedOrder = (
  (LimitOrder & SizedOrder) |
  (LimitOrder & SizedOrder & AutomatedOrder)
)

type Middleware = (store: Store) => (next: Function) => (action: StreamAction) => void

type Consumer = (err: Error, item: StreamAction | Highland.Nil, push: Function, next: Function) => void

type CreatedOrder = Order & {
  commission: Decimal,
  quantity: Decimal,
  price: Decimal,
  timestamp: number
}

type ExecutedOrder = CreatedOrder & {id: string}

type OrdersState = {[key: string]: ExecutedOrder}

type RootState = {
  capital: CapitalState,
  orders: OrdersState,
  positions: PositionsState,
  timestamp: TimestampState
}

type DevAlphaOptions = {
  backtesting: boolean,
  client: any,
  project: string,
  startCapital: number,
  initialStates: RootState,
  feeds: {
    [key: string]: any
  },
  backtest: {
    timestamp: number,
    commission: number | Function,
  },
  guard: GuardOptions,
  dashboard: {
    active: boolean,
    port: number
  }
}

type Context = {
  state: () => RootState,
  order: (order: RequestedOrder) => void,
  cancel: (id: string) => StreamAction,
}

type Strategy = (context: Context, action: StreamAction) => void
