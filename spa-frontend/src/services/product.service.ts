import { axiosInstance } from "@/axios-boot/axios"
import type { Product } from "@/types/product.type"
import { BaseHttpClientService } from "@/services/base-http-client.service"

export class ProductService extends BaseHttpClientService<Product, Product> {
  protected axiosInstance = axiosInstance

  constructor() {
    super("/products")
  }
}

export const productService = new ProductService()
