import { Component ,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CarritoComponent {
  carrito: any[] = [];
  recibo: string = '';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  eliminarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  generarXML() {
    this.recibo = this.carritoService.generarXML();
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  regresar(): void {
    this.router.navigate(['/productos']);
  }

  descargarRecibo() {
    const contenido = this.carritoService.generarTextoRecibo();
    this.descargarArchivo(contenido, 'recibo.txt', 'text/plain');
  }

  descargarXML() {
    const contenido = this.carritoService.generarXML();
    this.descargarArchivo(contenido, 'recibo.xml', 'application/xml');
  }

  private descargarArchivo(contenido: string, nombreArchivo: string, tipo: string) {
    const blob = new Blob([contenido], { type: tipo });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(enlace.href);
  }
}
