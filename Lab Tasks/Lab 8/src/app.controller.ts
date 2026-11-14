import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'ETHNC E-Commerce Store REST API (Lab 8)',
      status: 'online',
      version: '1.0.0',
      course: 'Full Stack Web Development (CS-301L)',
      student: 'Nawal Fateh',
      framework: 'NestJS (Modules, Services, Controllers only)',
      endpoints: {
        products: '/products',
        users: '/users',
        cart: '/cart/:userId',
        orders: '/orders',
        health: '/health'
      }
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
