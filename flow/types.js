// @flow
/* eslint-disable no-unused-vars */
import Decimal from 'decimal.js'
import type Highland from 'highland'

type TimestampState = number

interface IBar {
  timestamp: number,
  identifier: string,
  open: number | Decimal,
  high: number | Decimal,
  low: number | Decimal,
  close: number | Decimal
}

type OrdersState = {
  [key: string]: ExecutedOrder
}

interface Position {
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

interface Feeds<R> {
  [key: string]: Highland.Stream<R>
}

interface FeedItem {
  timestamp: number,
  [key: string]: any
}

interface StreamAction {
  type: string,
  payload: FeedItem
}

interface GuardOptions {
  shorting?: boolean,
  margin?: boolean,
  restricted?: string[]
}

interface DevAlphaOptions {
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

interface Store {
  dispatch: Function,
  getState: Function,
  setState: Function
}

interface RootState {
  capital: CapitalState,
  orders: OrdersState,
  positions: PositionsState,
  timestamp: TimestampState
}

interface Order {
  identifier: string
}

interface LimitOrder extends Order { price: number }

interface QuantityOrder extends Order { quantity: number }
interface PercentageOrder extends Order { percent: number }

interface StopOrder extends Order { trigger: number }
interface TrailingOrder extends Order { threshold: number }

type AutomatedOrder = StopOrder | TrailingOrder
type SizedOrder = PercentageOrder | QuantityOrder

type RequestedOrder = (
  (LimitOrder & SizedOrder) |
  (LimitOrder & SizedOrder & AutomatedOrder)
)

interface Context {
  state: () => RootState,
  order: (order: RequestedOrder) => void,
  cancel: (id: string) => StreamAction,
}

type Middleware = (store: Store) => (next: Function) => (action: StreamAction) => void

type Consumer = (err: Error, item: StreamAction | Highland.Nil, push: Function, next: Function) => void

interface CreatedOrder extends Order {
  commission: Decimal,
  quantity: Decimal,
  price: Decimal,
  timestamp: number
}

interface ExecutedOrder extends CreatedOrder {
  id: string
}

type Strategy = (context: Context, action: StreamAction) => void
