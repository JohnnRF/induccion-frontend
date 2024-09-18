import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
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


  selectedProducts: ProductApi[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  private productSubscription: Subscription;

  constructor(private productService: ProductService, private messageService: MessageService){
    
  }


  ngOnInit(): void {
    // llamar a la función que obtiene los usuarios desde el servicio
    this.getAllProducts();

    // estados para el formulario
    this.statuses = [
      {label: 'True', value: true},
      {label: 'False', value: false}
    ]
    
  }

  //Obtener la lista de productos
  getAllProducts(){
    this.productSubscription = this.productService.getApiProducts().subscribe(
      (response: ProductResponseApi) =>{
        console.log(response.products);
        this.products = response.products;
      }
    );
  }

  //Abrir modal para el registro de un nuevo producto
  openNew() {
    this.product = {};
    this.submitted = false;
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
            this.getAllProducts();
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
        this.getAllProducts();
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
          
          this.getAllProducts();
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


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();    
  }
  
}
