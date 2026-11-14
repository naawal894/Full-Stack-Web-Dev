import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  itemTotal: number;
}

export interface UserCart {
  userId: number;
  items: CartItem[];
  couponCode: string | null;
  discountPercentage: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

@Injectable()
export class CartService {
  private carts: Map<number, UserCart> = new Map();

  constructor(private readonly productsService: ProductsService) {}

  private getOrCreateCart(userId: number): UserCart {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        userId,
        items: [],
        couponCode: null,
        discountPercentage: 0,
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        total: 0
      });
    }
    return this.carts.get(userId)!;
  }

  private recalculateCart(cart: UserCart): UserCart {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);

    if (cart.discountPercentage > 0) {
      cart.discountAmount = Math.round((cart.subtotal * cart.discountPercentage) / 100);
    } else {
      cart.discountAmount = 0;
    }

    const discountedSubtotal = cart.subtotal - cart.discountAmount;

    // Free shipping rule from Lab 3 banner: Free shipping nationwide over PKR 5,000
    if (discountedSubtotal >= 5000 || cart.items.length === 0) {
      cart.shippingFee = 0;
    } else {
      cart.shippingFee = 250;
    }

    cart.total = cart.items.length === 0 ? 0 : discountedSubtotal + cart.shippingFee;
    return cart;
  }

  getCart(userId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    return this.recalculateCart(cart);
  }

  addItem(
    userId: number,
    data: { productId: number; quantity?: number; size?: string; color?: string }
  ): UserCart {
    if (!data.productId) {
      throw new BadRequestException('Product ID is required');
    }

    const qty = data.quantity && Number(data.quantity) > 0 ? Number(data.quantity) : 1;
    const product = this.productsService.findOne(Number(data.productId));

    if (product.stock < qty) {
      throw new BadRequestException(
        `Insufficient stock for "${product.name}". Available: ${product.stock}`
      );
    }

    const cart = this.getOrCreateCart(userId);
    const chosenSize = data.size || (product.sizes.length ? product.sizes[0] : 'Standard');
    const chosenColor = data.color || (product.colors.length ? product.colors[0] : 'Standard');

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === chosenSize &&
        item.color === chosenColor
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (product.stock < newQty) {
        throw new BadRequestException(
          `Cannot add more. Available stock: ${product.stock}, current in cart: ${cart.items[existingIndex].quantity}`
        );
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].itemTotal = newQty * product.price;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        size: chosenSize,
        color: chosenColor,
        itemTotal: qty * product.price
      });
    }

    return this.recalculateCart(cart);
  }

  updateItem(
    userId: number,
    data: { productId: number; quantity: number; size?: string; color?: string }
  ): UserCart {
    if (!data.productId || data.quantity === undefined) {
      throw new BadRequestException('Product ID and quantity are required');
    }

    const cart = this.getOrCreateCart(userId);
    const targetProduct = this.productsService.findOne(Number(data.productId));
    const newQty = Number(data.quantity);

    const index = cart.items.findIndex(
      (item) => item.productId === Number(data.productId)
    );

    if (index === -1) {
      throw new NotFoundException(`Product ${data.productId} not found in user's cart`);
    }

    if (newQty <= 0) {
      cart.items.splice(index, 1);
    } else {
      if (targetProduct.stock < newQty) {
        throw new BadRequestException(
          `Only ${targetProduct.stock} units available in stock`
        );
      }
      cart.items[index].quantity = newQty;
      cart.items[index].itemTotal = newQty * cart.items[index].price;
    }

    return this.recalculateCart(cart);
  }

  removeItem(userId: number, productId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    const index = cart.items.findIndex((item) => item.productId === productId);

    if (index === -1) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    cart.items.splice(index, 1);
    return this.recalculateCart(cart);
  }

  applyCoupon(userId: number, code: string): UserCart {
    if (!code) {
      throw new BadRequestException('Coupon code is required');
    }

    const normalizedCode = code.toUpperCase().trim();
    const cart = this.getOrCreateCart(userId);

    const VALID_COUPONS: Record<string, number> = {
      ETHNC10: 10,
      WELCOME10: 10,
      SALE20: 20
    };

    if (!(normalizedCode in VALID_COUPONS)) {
      throw new BadRequestException(
        `Invalid promo coupon. Try "ETHNC10" or "SALE20"`
      );
    }

    cart.couponCode = normalizedCode;
    cart.discountPercentage = VALID_COUPONS[normalizedCode];

    return this.recalculateCart(cart);
  }

  clearCart(userId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    cart.items = [];
    cart.couponCode = null;
    cart.discountPercentage = 0;
    cart.subtotal = 0;
    cart.discountAmount = 0;
    cart.shippingFee = 0;
    cart.total = 0;
    return cart;
  }
}
