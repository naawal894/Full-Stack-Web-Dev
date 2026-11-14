import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product, INITIAL_PRODUCTS } from './data/products.seed';

@Injectable()
export class ProductsService {
  private products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  private nextReviewId = 10;

  findAll(category?: string): Product[] {
    if (category) {
      const lowerCat = category.toLowerCase().trim();
      return this.products.filter(
        (p) => p.category.toLowerCase().includes(lowerCat)
      );
    }
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(data: Partial<Product>): Product {
    if (!data.name || !data.price || !data.category) {
      throw new BadRequestException('Name, price, and category are required');
    }

    const nextId = this.products.length > 0 
      ? Math.max(...this.products.map((p) => p.id)) + 1 
      : 1;

    const newProduct: Product = {
      id: nextId,
      name: data.name,
      description: data.description || '',
      category: data.category,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      discount: data.discount || null,
      stock: data.stock !== undefined ? Number(data.stock) : 10,
      sizes: Array.isArray(data.sizes) ? data.sizes : ['Standard'],
      colors: Array.isArray(data.colors) ? data.colors : ['Default'],
      reviews: [],
      createdAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, data: Partial<Product>): Product {
    const product = this.findOne(id);

    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.category !== undefined) product.category = data.category;
    if (data.price !== undefined) product.price = Number(data.price);
    if (data.originalPrice !== undefined) product.originalPrice = Number(data.originalPrice);
    if (data.discount !== undefined) product.discount = data.discount;
    if (data.stock !== undefined) product.stock = Number(data.stock);
    if (data.sizes !== undefined) product.sizes = data.sizes;
    if (data.colors !== undefined) product.colors = data.colors;

    return product;
  }

  remove(id: number): { success: boolean; message: string } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    return { success: true, message: `Product ${id} deleted successfully` };
  }

  addReview(
    productId: number,
    reviewData: { reviewerName: string; rating: number; comment: string }
  ) {
    const product = this.findOne(productId);

    if (!reviewData.reviewerName || reviewData.rating === undefined) {
      throw new BadRequestException('Reviewer name and rating are required');
    }

    const newReview = {
      id: this.nextReviewId++,
      reviewerName: reviewData.reviewerName,
      rating: Number(reviewData.rating),
      comment: reviewData.comment || '',
      createdAt: new Date().toISOString()
    };

    product.reviews.push(newReview);
    return {
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
      productRatingAverage: this.calculateAverageRating(product)
    };
  }

  decreaseStock(productId: number, quantity: number): void {
    const product = this.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
      );
    }
    product.stock -= quantity;
  }

  restoreStock(productId: number, quantity: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.stock += quantity;
    }
  }

  private calculateAverageRating(product: Product): number {
    if (!product.reviews.length) return 0;
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((total / product.reviews.length).toFixed(1));
  }
}
