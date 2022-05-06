import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  mensajeBtn: string = 'Nuevo Cliente';
  cardCrearClientes: boolean = false;
  listClientes: any[] = [];
  ClienteForm!: FormGroup;
  CrearCliente: boolean = false;
  divFormCliente: boolean = false;

  constructor(private clientesService: ClientesService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ClienteForm = this.fb.group({
      Nombres: ['', [Validators.required]],
      Apellidos: ['', [Validators.required]],
      Telefono: ['', [Validators.required]],
      TipoIdentificacion: ['', [Validators.required]],
      NroIdentificacion: ['', [Validators.required]],
      FechaNacimiento: ['', [Validators.required]],
      DireccionResidencia: ['', [Validators.required]],
    });
    this.traerClientes();
  }
  
  traerClientes(){
    this.clientesService.getClientes()
      .subscribe((resp: any) => {
        this.listClientes = resp;
        console.log(this.listClientes);
      })
  }


  crearClientes(){
    this.cardCrearClientes = !this.cardCrearClientes;
    this.mensajeBtn = this.cardCrearClientes ? 'Lista Clientes' : 'Nuevo Cliente';
  }

  enviarFormulario(){
    if(this.ClienteForm.invalid){
      this.ClienteForm.markAllAsTouched();
    }else{
      Swal.fire({
        title: '¿Crear Cliente?',
        text: `Esta a punto de crear el Cliente: ${ this.ClienteForm.value.nombre }`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Crear'
      }).then((result) => {
        if (result.value) {        
          this.clientesService.insertNewCliente(this.ClienteForm.value)
          .subscribe((resp: any) => {
            if(resp == true){
              Swal.fire("Producto creado", `El producto ${ this.ClienteForm.value.nombre } fue creado con éxito`, 'success');
              this.traerClientes();
              this.ClienteForm.reset();
            }else{
              Swal.fire("Error", `El producto ${ this.ClienteForm.value.nombre } no fue creado`, 'error');
            }
          });
        }
      })
    }

  }

  editarCliente(){

  }

  camposValidos(campo: string){
    return this.ClienteForm.controls[campo].errors && this.ClienteForm.controls[campo].touched; 
  }

}
