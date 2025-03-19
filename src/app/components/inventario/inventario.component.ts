import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { InventarioService } from '../../services/inventario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  productos: Producto[] = [];
  mostrarFormulario: boolean = false;
  nuevoProducto: Producto = new Producto(0, '', 0, '', 0); // Producto vacío para capturar datos
  recibo: string = ''; // Variable para almacenar el XML generado
  productoEditando: boolean = false; // Flag para saber si estamos editando un producto
  productoSeleccionado: Producto | null = null; // Producto seleccionado para edición

  constructor(private inventarioService: InventarioService, private router: Router) {}

  ngOnInit(): void {
    this.productos = this.inventarioService.obtenerInventario();

    if (!this.productos) {
      this.productos = [];  // Inicializar productos como un arreglo vacío si no existen
    }
  }

  // Función para manejar la subida de la imagen
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevoProducto.imagen = e.target.result; // Simula el almacenamiento de la imagen
      };
      reader.readAsDataURL(file); // Leemos la imagen como una URL base64
    }
  }

  // Función para agregar un nuevo producto
  agregarProducto(): void {
    if (this.nuevoProducto.nombre && this.nuevoProducto.precio && this.nuevoProducto.cantidad) {
      this.nuevoProducto.id = this.productos.length + 1;
      this.productos.push(this.nuevoProducto); // Agregar el nuevo producto al inventario
      this.inventarioService.agregarProductoAlLocalStorage(this.nuevoProducto); // Guardamos en localStorage

      this.nuevoProducto = new Producto(0, '', 0, '', 0);
    
      this.productoEditando = false;  // Asegura que sea "Agregar Producto"
      this.mostrarFormulario = true;
    }
  }

  // Función para editar un producto
  editarProducto(producto: Producto): void {
    this.productoSeleccionado = producto; // Guardamos el producto seleccionado para editar
    this.nuevoProducto = { ...producto }; // Copiamos los datos del producto al formulario
    this.productoEditando = true; // Activamos el modo de edición
    this.mostrarFormulario = true; // Mostramos el formulario
    
  }

  // Función para actualizar un producto ya existente
  actualizarProductoFormulario(): void {
    if (this.productoSeleccionado) {
      const productoActualizado = { ...this.nuevoProducto };
      this.inventarioService.actualizarProducto(productoActualizado); // Actualizamos el producto en el servicio
      this.productos = this.inventarioService.obtenerInventario(); // Actualizamos la lista de productos en la interfaz

      // Limpiar el formulario y cerrar
      this.nuevoProducto = new Producto(0, '', 0, '', 0);
      this.productoEditando = false;
      this.mostrarFormulario = false;
    }
  }

  actualizarCantidad(producto: Producto, event: Event): void {
    const input = event.target as HTMLInputElement;
    const cantidad = input.value;

    if (cantidad === '') {
      producto.cantidad = 0;
    } else {
      producto.cantidad = Number(cantidad);
      if (isNaN(producto.cantidad)) {
        producto.cantidad = 0;
      }
    }
  }

  eliminarProducto(id: number): void {
    this.inventarioService.eliminarProducto(id); // Eliminar del servicio y del localStorage
    this.productos = this.inventarioService.obtenerInventario(); // Actualizar la lista de productos
  }

  generarXML(): void {
    this.recibo = this.inventarioService.generarXML(); // Genera y almacena el XML
  }

  descargarXML(): void {
    if (!this.recibo) return;

    const blob = new Blob([this.recibo], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventario.xml'; // El nombre del archivo descargado
    link.click();
  }

  regresar(): void {
    this.router.navigate(['/productos']);
  }
}
