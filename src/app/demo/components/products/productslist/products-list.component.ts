import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Product, ProductApi, ProductResponseApi } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  providers: [MessageService]
})
export class ProductsListComponent implements OnInit, OnDestroy{

  productDialog: boolean = false;
  deleteProductDialog: boolean = false;


  products: ProductApi[] = [];
  product: ProductApi = {};

  submitted: boolean = false;

  statuses: any[] = [];


  private productSubscription: Subscription;

  totalRecords: number = 0;
  lastLazyLoadEvent: LazyLoadEvent;
  
  search  : string  = '';
  active  : boolean = null;
  minStock: number;

  constructor(private productService: ProductService, private messageService: MessageService){

  }

  ngOnInit(): void {
    // estados para el formulario
    this.statuses = [
      {label: 'True', value: true},
      {label: 'False', value: false}
    ]
    
  }

  //Obtener la lista de productos
  getAllProducts($event: LazyLoadEvent){
    //Guardar el último evento
    this.lastLazyLoadEvent = $event;

    // Obtener la página y el número de registros del $event
    const page     = ($event.first / $event.rows)+1;
    const pageSize = $event.rows;

    // Obtener parametros para el filtro
    const search   = this.search;
    const active   = this.active;
    const minStock = this.minStock;

    // Enviar parametros de paginación al servicio
    this.productSubscription = this.productService.getApiProducts(page, pageSize, search, active, minStock).subscribe(
      (response: ProductResponseApi) =>{
        this.products = response.items;
        this.totalRecords = response.totalRecords;
      }
    );
  }

  //Abrir modal para el registro de un nuevo producto
  openNew() {
    this.product       = {};
    this.submitted     = false;
    this.productDialog = true;
  }

  //Registrar o actualizar un nuevo producto
  saveProduct(){
    this.submitted = true; 


    if (this.product.productId) {
    // Enviar el producto y su ID al servicio que reliza el put
      this.productService.putApiProduct(this.product.productId, this.product)
        .subscribe(
          response => {
            this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Actualizado', life: 3000})
            //Actualiza la tabla de productos
            this.getAllProducts(this.lastLazyLoadEvent);
          },
          error =>{
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Error al actualizar producto' });
          }
        );
    } else{
    // Enviar el producto al servicio que reliza el post
    this.productService.postApiProduct(this.product).subscribe(
      response => {

        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Registrado', life: 3000})

        // Actualiza la tabla de productos
        this.getAllProducts(this.lastLazyLoadEvent);
      },
      error => {
        this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Error al registrar producto' });
      }
    );

    }

    // Cerrar el modal
    this.productDialog = false;
    
  }

  // Abrir el modal del formulario con los datos del registro selecionado
  editProduct(product: ProductApi){
    this.product = { ...product};
    this.productDialog = true;
  }

  // Abrir el modal con el el mensaje de adveretencia. 
  // Recibe el producto seleccionado para clonarlo
  deleteProduct(product: ProductApi) {
      this.deleteProductDialog = true;
      this.product = { ...product };
  }

  // Confirmar elminación del registro seleccionado
  confirmDelete() {
    this.deleteProductDialog = false;

    this.productService.deleteApiProduct(this.product.productId)
      .subscribe(
        response => {
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Eliminado', life: 3000})
          
          this.getAllProducts(this.lastLazyLoadEvent);
        },
        error => {
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Error al eliminar producto' });
        }
      );
  }


  // Ocultar el modal
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }


  applyFilters() {
    if (this.lastLazyLoadEvent) {
      this.getAllProducts(this.lastLazyLoadEvent);
    }
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();    
  }
  
}
