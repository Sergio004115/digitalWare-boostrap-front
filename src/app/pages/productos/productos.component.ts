import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../interfaces/productos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensajes.service';




@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  listProductos: Productos[] = [];
  divTableProductos: boolean = true;
  divFormProducto: boolean = false;
  public productoForm!: FormGroup;
  mensajeBtn: string = 'Nuevo Producto';
  idProducto!: number;
  CrearProd: boolean = true;
  productoBuscar!: string;

  constructor(private productosService: ProductosService, private fb: FormBuilder,
              private mensajesService: MensajesService) { }

  ngOnInit(): void {
    this.getProductos();
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      existencia: ['', [Validators.required]],

    });
  }

  getProductos() {
    this.productosService.getProductos()
      .subscribe((productos: any) => {
        this.listProductos = productos        
        console.log(this.listProductos);
      });
  }

  camposValidos(campo: string){
    return this.productoForm.controls[campo].errors && this.productoForm.controls[campo].touched; 
  }

  BuscarInvMinimo(){        
    this.productosService.getProdMinimoPermitido(5)
      .subscribe(resp => {
        if(resp.length === 0){
          this.mensajesService.mensajeInformativo('Actualmente no hay productos con stock minimo.');      
        }else{
          this.listProductos = resp;
        }
      });
  }

  habFormNuevoProducto(){
    this.mensajeBtn = this.divTableProductos ? 'Total en Existencia' : 'Nuevo Producto';
    this.divTableProductos = !this.divTableProductos;
    this.divFormProducto = !this.divFormProducto;
  } 

  enviarFormulario(){
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
    }else{
      Swal.fire({
        title: '¿Crear Producto?',
        text: `Esta a punto de crear el producto: ${ this.productoForm.value.nombre }`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, enviar'
      }).then((result) => {
        if (result.value) {        
         this.productosService.insertNewProducto(this.productoForm.value)
          .subscribe(resp => {
            if(resp == true){
              Swal.fire("Producto creado", `El producto ${ this.productoForm.value.nombre } fue creado con éxito`, 'success');
              this.getProductos();
              this.divFormProducto = false;
              this.divTableProductos = true;
              this.productoForm.reset();
            }else{
              Swal.fire("Error", `El producto ${ this.productoForm.value.nombre } no fue creado`, 'error');
            }
          });
        }
      })
    }

  }

  habEditarProducto(producto: Productos){
    if (producto.IdProducto) {
      this.CrearProd = false;
      this.idProducto = producto.IdProducto;
      this.productoForm.patchValue({        
        nombre: producto.Nombre,
        precio: producto.Precio,
        existencia: producto.Existencia
      });
      this.divTableProductos = !this.divTableProductos;
      this.divFormProducto = !this.divFormProducto;
      
  }
  }

  editarProd() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
    }else{
      Swal.fire({
        title: '¿Editar Producto?',
        text: `Esta a punto de editar el producto: ${ this.productoForm.value.nombre }`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, enviar'
      }).then((result) => {
        if (result.value) {        
          this.productosService.updateProducto(this.idProducto, this.productoForm.value)
          .subscribe(resp => {
            if(resp == true){
              Swal.fire("¡Producto editado!", `El producto ${ this.productoForm.value.nombre } fue editado con éxito`, 'success');
              this.getProductos();
              this.divFormProducto = false;
              this.divTableProductos = true;
              this.idProducto!= null;
              this.productoForm.reset();
            }else{
              Swal.fire("Error", `El producto ${ this.productoForm.value.nombre } no fue editado`, 'error');
            }
          });
        }
      })
    }  
}

  eliminarProd(producto: Productos) {
    Swal.fire({
      title: 'Eliminar Producto?',
      text: `Esta a punto de eliminar el producto: ${ producto.Nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {        
        this.productosService.eliminarProducto(producto.IdProducto!)
        .subscribe(resp => {
          if(resp == true){
            Swal.fire("¡Producto editado!", `El producto fue eliminado con éxito`, 'success');
            this.getProductos();
            this.divFormProducto = false;
            this.divTableProductos = true;            
          }else{
            Swal.fire("Error", `El producto no fue eliminado`, 'error');
          }
        });
      }
    })
    
  }

  buscarProd(){
    this.productosService.getProductoBusqueda(this.productoBuscar)
      .subscribe(resp => {
        if(resp.length === 0){
          this.mensajesService.mensajeInformativo("No se encontro ningún producto con ese nombre");          
        }else{
          this.listProductos = resp;
        }
        this.productoBuscar = "";
      });
  }


  

}
