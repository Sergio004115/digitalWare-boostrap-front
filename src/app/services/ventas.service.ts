import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Productos } from '../interfaces/productos.interface';
import { ComprasClientesNoMayoresEdad } from '../interfaces/comprasClientesNoMayor.interface';


const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  insertNewVenta(data: Productos){
    const url = `${baseUrl}Ventas/InsertNewVenta`;
    return this.http.post(url, data);

  }

  getclientesNoMayorAños(){
    const url = `${baseUrl}Ventas/getClientesNoMayor`;
    return this.http.get<ComprasClientesNoMayoresEdad>(url);
  }

  getTotalComprasPorAnio(){
    const url = `${baseUrl}Ventas/getTotalVentaPorProducto`;
    return this.http.get<any>(url);
  }

  getFechaEstimadaCompra(){
    const url = `${baseUrl}Ventas/getEstimacionVentar`;
    return this.http.get<any>(url);
  }




}
