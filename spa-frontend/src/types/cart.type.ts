export type CartItem = {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  value: number
}

export type Cart = {
  id: string
  userId: string
  price: number
  products: CartItem[]
}

export type AddProductPayload = {
  productId: string
  productName: string
  quantity: number
  price: number
}

export type UpdateQuantityPayload = {
  quantity: number
}
