import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('products')
  getProducts() {
    return this.gatewayService.getProducts();
  }

  @Get('cart')
  getCart() {
    return this.gatewayService.getCart();
  }
}
