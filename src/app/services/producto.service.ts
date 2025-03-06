import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos:Producto[]=[
    new Producto(1, 'DATA', 1200, 'assets/foto1.png'),
    new Producto(2, 'dtmf', 899, 'assets/foto2.png'),
    new Producto(3, 'duolingo peluche', 6666, 'assets/foto3.png'),
 
  ];
  
  obtenerProducto():Producto[]{
     return this.productos;
  }
}