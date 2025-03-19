import { Routes } from '@angular/router';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InventarioComponent } from './components/inventario/inventario.component';

export const routes: Routes = [
  { path: 'productos', component: ProductoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }, // Redirigir a productos por defecto
  { path: '**', redirectTo: '/productos' } // Redirigir cualquier ruta no encontrada a productos
];
