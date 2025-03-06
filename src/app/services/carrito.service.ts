import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];

  obtenerCarrito() {
    return this.carrito;
  }

  agregarProducto(producto: any) {
    this.carrito.push(producto);
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  generarTextoRecibo(): string {
    return this.carrito.map(p => `${p.nombre}: $${p.precio}`).join('\n') + `\nTotal: $${this.calcularTotal()}`;
  }

  generarXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<carrito>\n` +
      this.carrito.map(p => `  <producto><nombre>${p.nombre}</nombre><precio>${p.precio}</precio></producto>`).join('\n') +
      `\n  <total>${this.calcularTotal()}</total>\n</carrito>`;
  }
}
