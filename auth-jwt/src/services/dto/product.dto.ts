export class CreateProductDto {
  name: string;
  price: number;
}

export class UpdateProductDto {
  name?: string;
  price?: number;
}
