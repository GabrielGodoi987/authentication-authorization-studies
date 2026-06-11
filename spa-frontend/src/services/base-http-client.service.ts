import type { AxiosInstance } from "axios"

export class HttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "HttpError"
    this.status = status
  }
}

export abstract class BaseHttpClientService<TSendEntity, TGetEntity> {
  protected abstract axiosInstance: AxiosInstance
  protected route: string

  constructor(route: string) {
    this.route = route
  }

  async getEntities(): Promise<TGetEntity[]> {
    const request = await this.axiosInstance.get(this.route)
    return request.data as TGetEntity[]
  }

  async getEntity(id: string): Promise<TGetEntity> {
    const request = await this.axiosInstance.get(`${this.route}/${id}`)
    return request.data as TGetEntity
  }

  async createEntity(data: TSendEntity): Promise<TGetEntity> {
    const request = await this.axiosInstance.post(this.route, data)
    return request.data as TGetEntity
  }

  async updateEntity(id: string, data: Partial<TSendEntity>): Promise<TGetEntity> {
    const request = await this.axiosInstance.patch(`${this.route}/${id}`, data)
    return request.data as TGetEntity
  }

  async deleteEntity(id: string): Promise<void> {
    await this.axiosInstance.delete(`${this.route}/${id}`)
  }
}
