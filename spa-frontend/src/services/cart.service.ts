import { axiosInstance } from "@/axios-boot/axios"
import type { Cart, AddProductPayload, UpdateQuantityPayload } from "@/types/cart.type"
import { BaseHttpClientService } from "@/services/base-http-client.service"

export class CartService extends BaseHttpClientService<never, Cart> {
  protected axiosInstance = axiosInstance

  constructor() {
    super("/carts")
  }

  async getCartById(id: string): Promise<Cart> {
    return this.getEntity(id)
  }

  async createCart(): Promise<Cart> {
    const request = await this.axiosInstance.post(this.route)
    return request.data as Cart
  }

  async deleteCart(id: string): Promise<void> {
    return this.deleteEntity(id)
  }

  async getCurrentCart(): Promise<Cart> {
    const request = await this.axiosInstance.get(this.route)
    return request.data as Cart
  }

  async addProduct(cartId: string, payload: AddProductPayload): Promise<Cart> {
    const request = await this.axiosInstance.post(
      `${this.route}/${cartId}/products`,
      payload,
    )
    return request.data as Cart
  }

  async updateProductQuantity(
    cartId: string,
    productId: string,
    payload: UpdateQuantityPayload,
  ): Promise<Cart> {
    const request = await this.axiosInstance.put(
      `${this.route}/${cartId}/products/${productId}`,
      payload,
    )
    return request.data as Cart
  }

  async removeProduct(cartId: string, productId: string): Promise<Cart> {
    const request = await this.axiosInstance.delete(
      `${this.route}/${cartId}/products/${productId}`,
    )
    return request.data as Cart
  }
}

export const cartService = new CartService()
