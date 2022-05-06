import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { NgModule } from "@angular/core";



const routes: Routes = [
    { 
        path: '',   
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'clientes', component: ClientesComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'ventas', component: VentasComponent },

        ]
    }];

    @NgModule({
        imports: [ RouterModule.forChild(routes) ],
        exports: [ RouterModule ]
    })
    export class PagesRoutingModule {}