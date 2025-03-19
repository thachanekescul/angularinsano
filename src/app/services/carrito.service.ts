import { Injectable } from "@angular/core";
import { Producto } from "../models/producto";
import { ProductoService } from './producto.service'; // Asegúrate de importar el ProductoService

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  constructor(private productoService: ProductoService) {
    // Cargar el carrito desde localStorage si está disponible
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  // Agregar un producto al carrito
  agregarProducto(producto: Producto) {
    this.carrito.push(producto);
    this.guardarCarrito(); // Guardamos el carrito en el localStorage después de agregar el producto
  }

  // Obtener el carrito desde localStorage
  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  // Eliminar un producto del carrito
  eliminarProducto(index: number) {
    if (index >= 0 && index < this.carrito.length) {
      this.carrito.splice(index, 1);
      this.guardarCarrito(); // Guardamos el carrito actualizado
    }
  }

  // Calcular el subtotal del carrito
  calcularSubtotal(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  // Calcular el IVA
  calcularIVA(): number {
    return this.calcularSubtotal() * 0.16; // IVA del 16%
  }

  // Calcular el total
  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  // Generar el XML del recibo
  generarXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<compra>\n';
    
    // Añadir productos al XML (cantidad es 1)
    this.carrito.forEach((producto) => {
      xml +=   `<producto id="${producto.id}" cantidad="1">\n`;
      xml +=     `<nombre>${producto.nombre}</nombre>\n`;
      xml +=     `<precio>${producto.precio}</precio>\n`;
      xml +=   `</producto>\n`;
      
    });

    const subtotal = this.calcularSubtotal();
    const iva = this.calcularIVA();
    const total = this.calcularTotal();

    xml +=   `<subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml +=   `<iva>${iva.toFixed(2)}</iva>\n`;
    xml +=   `<total>${total.toFixed(2)}</total>\n`;
    xml +=   `<tienda>Gracias por tu compra en ChinoSneakers</tienda>\n`;

    xml += '</compra>';
    
    // Limpiar el carrito tras la compra
    this.limpiarCarrito();
    
    return xml;
  }

  // Guardar el carrito en localStorage
  private guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  // Limpiar el carrito después de la compra
  private limpiarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  }

// Actualizar el inventario después de realizar una compra
actualizarInventario(carrito: Producto[]) {
    // Obtener los productos desde el ProductoService
    let productos = this.productoService.obtenerProducto();
    
    // Iterar sobre los productos en el carrito y actualizar la cantidad
    carrito.forEach(productoCarrito => {
      const productoInventario = productos.find(producto => producto.id === productoCarrito.id);
      if (productoInventario) {
        // Restar la cantidad comprada al inventario
        productoInventario.cantidad -= 1;
        // Actualizar el producto en el localStorage
        this.productoService.actualizarProducto(productoInventario);
      }
    });
  }
  
}
