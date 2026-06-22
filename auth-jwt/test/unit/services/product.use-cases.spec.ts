import { ProductEntity } from "../../../src/domain/entities/product.entity";
import { ProductRepository } from "../../../src/domain/repositories/product.repository";
import {
  InvalidProductPriceException,
  ProductNameCannotBeEmptyException,
  ProductNotFoundException,
} from "../../../src/domain/domain-exceptions/product.exceptions";
import { FindProductByIdSpec } from "../../../src/domain/specifications/product.specification";
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindAllProductsUseCase,
  FindByIdProductUseCase,
  UpdateProductUseCase,
} from "../../../src/services/product.use-cases";
import { context } from "../../helpers/context";

describe("product use cases - unit test", () => {
  let mockProductRepository: jest.Mocked<ProductRepository>;
  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  context("FindAllProductUseCase", () => {
    let findAllProductsUseCase: FindAllProductsUseCase;

    beforeEach(() => {
      findAllProductsUseCase = new FindAllProductsUseCase(
        mockProductRepository,
      );
    });

    it("should fetch and return all the products", async () => {
      const products = [
        new ProductEntity("1", "Product 1", 100),
        new ProductEntity("2", "Product 2", 200),
      ];
      mockProductRepository.findAll.mockResolvedValue(products);

      const result = await findAllProductsUseCase.execute({ skip: 0, take: 10 });

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 });
      expect(result).toEqual(products);
    });
  });

  context("FindOneProductUseCase", () => {
    let findByIdProductUseCase: FindByIdProductUseCase;
    beforeEach(() => {
      findByIdProductUseCase = new FindByIdProductUseCase(
        mockProductRepository,
      );
    });

    it("should find only one product", async () => {
      const product = new ProductEntity("1", "Product 1", 100);
      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await findByIdProductUseCase.execute({ id: "1" });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(result).toEqual(product);
    });

    it("should throw an error when product is not found", async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await findByIdProductUseCase.execute({ id: "not-found" });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(result).toBeInstanceOf(ProductNotFoundException);
    });
  });

  context("CreateProductUseCase", () => {
    let createProductUseCase: CreateProductUseCase;
    beforeEach(() => {
      createProductUseCase = new CreateProductUseCase(mockProductRepository);
    });

    it("should create a product and return the created product", async () => {
      const dto = { name: "Product 1", price: 100 };
      const savedProduct = new ProductEntity("1", "Product 1", 100);
      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await createProductUseCase.execute(dto);

      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.any(ProductEntity),
      );
      expect(result).toBeInstanceOf(ProductEntity);
      expect((result as ProductEntity).getName()).toBe("Product 1");
      expect((result as ProductEntity).getPrice()).toBe(100);
    });

    it("should throw an erro when name is empty", async () => {
      const dto = { name: "", price: 100 };

      const result = await createProductUseCase.execute(dto);

      expect(mockProductRepository.save).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ProductNameCannotBeEmptyException);
    });

    it("should throw an erro when price is empty", async () => {
      const dto = { name: "Product 1", price: NaN };

      const result = await createProductUseCase.execute(dto);

      expect(mockProductRepository.save).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(InvalidProductPriceException);
    });
  });

  context("UpdateProductUseCase", () => {
    let updateProductUseCase: UpdateProductUseCase;
    beforeEach(() => {
      updateProductUseCase = new UpdateProductUseCase(mockProductRepository);
    });

    it("should update the name and price of a product", async () => {
      const existingProduct = new ProductEntity("1", "Old Name", 50);
      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      const updatedProduct = new ProductEntity("1", "New Name", 100);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await updateProductUseCase.execute("1", {
        name: "New Name",
        price: 100,
      });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ getId: expect.any(Function) }),
      );
      expect(result).toEqual(updatedProduct);
    });

    it("should update only the name of product", async () => {
      const existingProduct = new ProductEntity("1", "Old Name", 50);
      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      const updatedProduct = new ProductEntity("1", "New Name", 50);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await updateProductUseCase.execute("1", {
        name: "New Name",
      });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ getId: expect.any(Function) }),
      );
      expect(result).toEqual(updatedProduct);
    });

    it("should update only the price of product", async () => {
      const existingProduct = new ProductEntity("1", "Old Name", 50);
      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      const updatedProduct = new ProductEntity("1", "Old Name", 150);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await updateProductUseCase.execute("1", {
        price: 150,
      });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ getId: expect.any(Function) }),
      );
      expect(result).toEqual(updatedProduct);
    });

    it("should throw and erro when product is not found", async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(
        updateProductUseCase.execute("1", { name: "New" }),
      ).rejects.toThrow(ProductNotFoundException);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });
  });

  context("DeleteProductUseCase", () => {
    let deleteProductUseCase: DeleteProductUseCase;
    beforeEach(() => {
      deleteProductUseCase = new DeleteProductUseCase(mockProductRepository);
    });

    it("should delete a product", async () => {
      const product = new ProductEntity("1", "Product 1", 100);
      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.delete.mockResolvedValue(true);

      const result = await deleteProductUseCase.execute({ id: "1" });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });

    it("should throw not found error when product is not found", async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await deleteProductUseCase.execute({ id: "not-found" });

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(
        expect.any(FindProductByIdSpec),
      );
      expect(mockProductRepository.delete).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ProductNotFoundException);
    });
  });
});
