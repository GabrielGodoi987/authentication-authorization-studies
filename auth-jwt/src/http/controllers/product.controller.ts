import { NextFunction, Request, Response } from "express";
import { ProductRepositoryImpl } from "../../infrastructure/repositories/product.repository";
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindAllProductsUseCase,
  FindByIdProductUseCase,
  UpdateProductUseCase,
} from "../../services/product.use-cases";

const repo = new ProductRepositoryImpl();
const createUseCase = new CreateProductUseCase(repo);
const findAllUseCase = new FindAllProductsUseCase(repo);
const findOneUseCase = new FindByIdProductUseCase(repo);
const updateUseCase = new UpdateProductUseCase(repo);
const deleteUseCase = new DeleteProductUseCase(repo);

export class ProductController {
  public static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip = 0, take = 10 } = req.query;
      const products = await findAllUseCase.execute({
        skip: Number(skip),
        take: Number(take),
      });

      res.status(200).json(products.map((product) => product.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  public static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await findOneUseCase.execute({ id: id as string });

      res.status(200).json(product.toJSON());
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price } = req.body;

      const product = await createUseCase.execute({ name, price });
      res.status(201).json(product.toJSON());
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      const product = await updateUseCase.execute(id as string, {
        name,
        price,
      });

      res.status(200).json(product?.toJSON());
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deleteUseCase.execute({ id: id as string });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
