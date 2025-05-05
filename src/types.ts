export interface Trade {
  _id: string;
  symbol: string
  gap: number
  eclipseBuffer: number
  volume: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TradeFormData {
  symbol: string;
  GAP: number;
  ECLIPSE_BUFFER: number;
  volume: number;
}

export interface TradeHistoryTypes {
  _id: string
  tradeId: string
  price: number
  action: string
  direction: string
  checkpoint: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}