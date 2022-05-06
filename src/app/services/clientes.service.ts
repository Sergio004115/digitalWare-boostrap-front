import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Clientes } from '../interfaces/clientes.interface';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor( private http: HttpClient) { }

  getClientes(){
    const url = `${baseUrl}Clientes/getClientes`;
    return this.http.get<Clientes>(url);
  }

  insertNewCliente(data: any){
    const url = `${baseUrl}Clientes/InsertClientes`;
    return this.http.post<Clientes>(url, data)
  }





}
