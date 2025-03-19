import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private productoService: ProductoService) {}

  // Método para obtener el inventario desde localStorage
  obtenerInventario(): Producto[] {
    const productosGuardados = localStorage.getItem('productos');
    
    // Si no hay productos guardados, almacenar los productos iniciales en localStorage
    if (!productosGuardados) {
      const productosIniciales = this.productoService.obtenerProducto();
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
      return productosIniciales;
    }
    
    // Si hay datos en localStorage, los parseamos y los devolvemos
    return JSON.parse(productosGuardados) || []; // Retorna un arreglo vacío si el parseo falla
  }

  // Método para agregar un producto al localStorage
  agregarProductoAlLocalStorage(producto: Producto): void {
    let productos = this.obtenerInventario();
    productos.push(producto); // Agregar el nuevo producto al arreglo
    localStorage.setItem('productos', JSON.stringify(productos)); // Guardamos el arreglo actualizado en localStorage
  }

  // Método para actualizar el producto y guardar los cambios en localStorage
  actualizarProducto(producto: Producto): void {
    let productos = this.obtenerInventario();
    const index = productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      productos[index] = producto;  // Actualizamos el producto
      // Guardamos los productos actualizados en localStorage
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }

  // Método para eliminar un producto y actualizar localStorage
  eliminarProducto(id: number): void {
    let productos = this.obtenerInventario();
    productos = productos.filter(producto => producto.id !== id);
    // Actualizamos localStorage con los productos restantes
    localStorage.setItem('productos', JSON.stringify(productos));
  }

  // Método para generar el XML de los productos
  generarXML(): string {
    const productos = this.obtenerInventario();
    
    // Obtener la fecha y hora actuales
    const fechaHora = new Date().toISOString(); // Formato ISO 8601: ejemplo "2025-03-19T14:30:00Z"
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<marca>"INVENTARIO SCI-SHOP</marca>`;
    // Añadir la fecha y hora de visualización al XML
    xml += `<fecha_visualizacion>${fechaHora}</fecha_visualizacion>\n`;
    
    xml += '<productos>\n';
    
    productos.forEach(producto => {
      xml += `  <producto>\n`;
      xml += `    <id>${producto.id}</id>\n`;
      xml += `    <nombre>${producto.nombre}</nombre>\n`;
      xml += `    <cantidad>${producto.cantidad}</cantidad>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${producto.imagen}</imagen>\n`;
      xml += `  </producto>\n`;
    });
    
    xml += '</productos>';
    
    return xml;
  }
}
