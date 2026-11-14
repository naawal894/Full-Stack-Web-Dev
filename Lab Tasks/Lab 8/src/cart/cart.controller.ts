import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(Number(userId));
  }

  @Post(':userId')
  addItem(@Param('userId') userId: string, @Body() body: any) {
    return this.cartService.addItem(Number(userId), body);
  }

  @Patch(':userId')
  updateItem(@Param('userId') userId: string, @Body() body: any) {
    return this.cartService.updateItem(Number(userId), body);
  }

  @Delete(':userId/item/:productId')
  removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeItem(Number(userId), Number(productId));
  }

  @Post(':userId/coupon')
  applyCoupon(@Param('userId') userId: string, @Body() body: any) {
    return this.cartService.applyCoupon(Number(userId), body.code);
  }

  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(Number(userId));
  }
}
