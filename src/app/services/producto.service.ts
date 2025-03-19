import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Aquí definimos los productos iniciales
  private productosIniciales: Producto[] = [
    new Producto(1, 'DATA', 1200, 'assets/foto1.png',10),
    new Producto(2, 'dtmf', 899, 'assets/foto2.png',10),
    new Producto(3, 'duolingo peluche', 6666, 'assets/foto3.png',666),
  ];

  constructor() {
    this.cargarProductosEnLocalStorage();
  }

  // Método para cargar los productos desde localStorage o usar los iniciales
  private cargarProductosEnLocalStorage(): void {
    let productosGuardados = localStorage.getItem('productos');
    
    // Si no hay productos en localStorage, los guardamos
    if (!productosGuardados) {
      localStorage.setItem('productos', JSON.stringify(this.productosIniciales));
    }
  }

  // Método para obtener los productos (desde localStorage)
  obtenerProducto(): Producto[] {
    const productosGuardados = localStorage.getItem('productos');
    let productos = productosGuardados ? JSON.parse(productosGuardados) : [];
    
    // Asegurar que la cantidad no sea null o undefined, si es el caso, asignamos 10
    productos = productos.map((producto: Producto) => {
      if (producto.cantidad == null) {
        producto.cantidad = 10;  // Asigna el valor por defecto 10 si cantidad es null o undefined
      }
      return producto;
    });

    return productos;
  }

  // Método para actualizar un producto en localStorage
  actualizarProducto(producto: Producto): void {
    let productos = this.obtenerProducto();
    const index = productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      productos[index] = producto;  // Actualizamos el producto
      // Guardamos los productos actualizados en localStorage
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }

  
}
