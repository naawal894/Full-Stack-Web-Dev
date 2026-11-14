import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService, CartItem } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private nextOrderId = 1;

  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService
  ) {}

  createOrder(data: {
    userId: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }): Order {
    if (!data.userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!data.shippingAddress || !data.shippingAddress.fullName || !data.shippingAddress.address || !data.shippingAddress.city) {
      throw new BadRequestException('Shipping full name, address, and city are required');
    }

    if (!data.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }

    const cart = this.cartService.getCart(Number(data.userId));

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Shopping cart is empty. Add items before placing an order.');
    }

    // Verify stock availability and deduct
    for (const item of cart.items) {
      this.productsService.decreaseStock(item.productId, item.quantity);
    }

    const orderId = this.nextOrderId++;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ETH-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: Number(data.userId),
      items: JSON.parse(JSON.stringify(cart.items)),
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      shippingFee: cart.shippingFee,
      total: cart.total,
      shippingAddress: {
        fullName: data.shippingAddress.fullName,
        phone: data.shippingAddress.phone || '',
        address: data.shippingAddress.address,
        city: data.shippingAddress.city,
        province: data.shippingAddress.province || 'Punjab',
        postalCode: data.shippingAddress.postalCode || '44000'
      },
      paymentMethod: data.paymentMethod,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    this.orders.push(newOrder);

    // Clear cart after successful checkout
    this.cartService.clearCart(Number(data.userId));

    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  findByUser(userId: number): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  updateStatus(id: number, status: string): Order {
    const order = this.findOne(id);
    const validStatuses: Order['status'][] = [
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status as Order['status'])) {
      throw new BadRequestException(
        `Invalid status. Allowed: ${validStatuses.join(', ')}`
      );
    }

    // If transitioning to Cancelled from another state, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        this.productsService.restoreStock(item.productId, item.quantity);
      }
    }

    order.status = status as Order['status'];
    return order;
  }

  cancelOrder(id: number): { success: boolean; message: string; order: Order } {
    const updated = this.updateStatus(id, 'Cancelled');
    return {
      success: true,
      message: `Order ${updated.orderNumber} has been cancelled and inventory restored`,
      order: updated
    };
  }
}
