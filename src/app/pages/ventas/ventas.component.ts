import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Clientes } from 'src/app/interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../interfaces/productos.interface';
import Swal from 'sweetalert2';
import { VentasService } from '../../services/ventas.service';
import { ComprasClientesNoMayoresEdad } from '../../interfaces/comprasClientesNoMayor.interface';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  public ventaForm!: FormGroup;
  divFormVenta: boolean = true;
  tableNoMayor: boolean = false;
  tablePorAnio: boolean = false;
  tableEstimacion: boolean = false;
  listClientes: Clientes[] = [];
  listProductos: Productos[] = [];
  listCompraAnio: any[] = [];
  listEstimadaCompra: any[] = [];
  valorProducto!: number;
  resultadoTotalVenta!: number;
  existenciaProducto!: number;
  fechaEstimada: Date = new Date();
  listClientesNoMayor: ComprasClientesNoMayoresEdad[] = [];

  constructor( private fb: FormBuilder, private clientesService: ClientesService, private productosService: ProductosService, private ventasService: VentasService) { }

  ngOnInit(): void {
    this.getClientes();
    this.getProductos();
    this.ventaForm = this.fb.group({
      cliente: ['', [Validators.required]],
      IdProducto: ['', [Validators.required]],
      CantidadProducto: ['', [Validators.required]],
      TotalVenta: new FormControl({ value: "", disabled: true })
  });
}

getClientes(){
  this.clientesService.getClientes()
    .subscribe((clientes: any) => {
      this.listClientes = clientes        
      console.log(this.listClientes);
      
    });
}

getProductos() {
  this.productosService.getProductos()
    .subscribe((productos: any) => {
      this.listProductos = productos        
      console.log(this.listProductos);
    });
}

getProductosById(idProducto:  number) {
  this.productosService.getProductosById(idProducto)
    .subscribe((productos: any) => {
      this.valorProducto = productos[0].Precio;  
      this.existenciaProducto = productos[0].Existencia;
      console.log(this.valorProducto, this.existenciaProducto);
    });
}

seleccionProd(event: any){
  console.log('Producto seleccionado', event.target.value);
  this.getProductosById(event.target.value);
  
}

totalVenta(){
  if(this.ventaForm.controls['CantidadProducto'].value > this.existenciaProducto){
     Swal.fire("Error", `La cantidad ingresada es mayor a la existencia`, 'error');
     this.resultadoTotalVenta = 0;
  }else{
    let cantidad = this.ventaForm.controls['CantidadProducto'].value;
    let precio = this.valorProducto;
    this.resultadoTotalVenta = cantidad * precio;
  }

}


camposValidos(campo: string){
  return this.ventaForm.controls[campo].errors && this.ventaForm.controls[campo].touched; 
}

realizarVenta(){
 if(this.ventaForm.invalid){
    this.ventaForm.markAllAsTouched();
 }else if(this.resultadoTotalVenta == 0 || this.resultadoTotalVenta == null){
    Swal.fire("Error", `El total de la venta no puede ser cero o menor`, 'error');
 }else{
   console.log(this.ventaForm.controls['TotalVenta'].value);
   const venta = {
    Cliente: this.ventaForm.controls['cliente'].value,
    IdProducto: this.ventaForm.controls['IdProducto'].value,
    CantidadProducto: this.ventaForm.controls['CantidadProducto'].value,
    TotalVenta: this.ventaForm.controls['TotalVenta'].value
   }
  this.ventasService.insertNewVenta(venta)
  .subscribe(resp => {
    if(resp== true){
      Swal.fire("¡Exito!", `Venta realizada correctamente`, 'success');
      this.ventaForm.reset();
    }else{
      Swal.fire("Error", `No se pudo realizar la venta`, 'error');
    }
  });
 }
}

generarVentas(){
  this.tableNoMayor = false;
  this.tablePorAnio = false;
  this.divFormVenta = true;
}

// comprasAnio(){
//   this.tablePorAnio = true;
//   this.tableNoMayor = false;
//   this.divFormVenta = false;
// }

buscarClientesNoMayor(){
  this.ventasService.getclientesNoMayorAños()
  .subscribe((resp: any) => {
    this.listClientesNoMayor = resp;
    if(this.listClientesNoMayor.length > 0){
      this.tableNoMayor = true;
      this.divFormVenta = false;
      this.tablePorAnio = false;
      this.tableEstimacion = false;
    }
    console.log(this.listClientesNoMayor);
  });
}

totalComprasPorAnio(){
  this.tablePorAnio = true;
  this.tableNoMayor = false;
  this.divFormVenta = false;
  this.ventasService.getTotalComprasPorAnio()
    .subscribe(resp => {
      this.listCompraAnio = resp;
      console.log(this.listCompraAnio);
    });
}

estimacionCompra(){
  this.tableEstimacion = true;
  this.tablePorAnio = false;
  this.tableNoMayor = false;
  this.divFormVenta = false;
  this.ventasService.getFechaEstimadaCompra()
      .subscribe(resp => {
        this.listEstimadaCompra = resp;          
        this.estimarCompra(this.listEstimadaCompra);
        console.log(this.listEstimadaCompra);
      });
}

estimarCompra(listEstimadaCompra: any){
  let anio = Number(listEstimadaCompra[0].UltimaCompra.substring(0, 4));
  let mes = Number(listEstimadaCompra[0].UltimaCompra.substring(5, 7));
  let dia = Number(listEstimadaCompra[0].UltimaCompra.substring(8, 10));    
  let fechaAjustada = new Date(anio, mes, dia);
  let resultadoAjustado = fechaAjustada = new Date( anio, fechaAjustada.getMonth() - 1, dia );
  let fechaEstimadaCompra = new Date(fechaAjustada.setDate(fechaAjustada.getDate() + listEstimadaCompra[0].diferenciaEntreCompras));

  this.fechaEstimada = fechaEstimadaCompra;
}


}
