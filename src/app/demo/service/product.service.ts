import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductApi } from '../api/product';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductService {

    private baseUrl: string = `${environment.baseUrl}/api/product`;

    constructor(private http: HttpClient) { }

    /**
     * Realizar petición GET a la API que devuelve todos los productos
     * @returns products[]
     */
    getApiProducts(){

        return this.http.get<any>(`${this.baseUrl}`);

    }

    /**
     * Realizar petición POST a la API
     * Se envía el objeto producto
     * La petición devuelve el producto ingresado
     * @param product 
     * @returns product
     */
    postApiProduct(product: ProductApi){
        return this.http.post<ProductApi>(`${this.baseUrl}`, product);
    }

    /**
     * Realizar petición PUT a la API
     * Se envía id del producto y el objeto producto
     * @param id 
     * @param product 
     * @returns NoContent
     */
    putApiProduct(id: number, product: ProductApi){
        return this.http.put<any>(`${this.baseUrl}/${id}`, product);
    }

    /**
     * Realizar petición DELETE a la API
     * Se envía el id del producto a eliminar
     * @param id 
     * @returns NoContent
     */
    deleteApiProduct(id: number){
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }



    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts() {
        return this.http.get<any>('assets/demo/data/products.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
