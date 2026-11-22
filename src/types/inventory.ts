export interface SellerInventoryRow {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  active: boolean
  potterId: string
  weight?: number
  category?: string
  createdAt?: string
  updatedAt?: string
}
