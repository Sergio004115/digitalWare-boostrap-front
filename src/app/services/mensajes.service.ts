import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }



  mensajeInformativo(message: string){
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 2500
    }) 
  }
}
