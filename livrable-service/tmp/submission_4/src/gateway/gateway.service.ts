import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(private readonly httpService: HttpService) {}

  async getProducts() {
    const response = await lastValueFrom(
      this.httpService.get(process.env.PRODUCT_SERVICE_URL + '/api/products')
    );
    return response.data;
  }

  async getCart() {
    const response = await lastValueFrom(
      this.httpService.get(process.env.CART_SERVICE_URL + '/api/cart')
    );
    return response.data;
  }
}
