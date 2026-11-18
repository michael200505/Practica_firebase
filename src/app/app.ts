import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductoService } from './services/producto';
import { Producto } from './models/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('practica-firebase');

  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);
  private subscripcionProductos!: Subscription;

  productos: Producto[] = [];
  cargando = true;
  modoEdicion = false;
  idEdicion: string | null = null;
  mensajeError: string | null = null;

  formProducto: Omit<Producto, 'id'> = {
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: ''
  };

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    if (this.subscripcionProductos) {
      this.subscripcionProductos.unsubscribe();
    }
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = null;

    this.subscripcionProductos = this.productoService.obtenerProductosEnTiempoReal().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'Error al conectar con Cloud Firestore en tiempo real.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.formProducto.nombre || this.formProducto.nombre.trim() === '') {
      this.mensajeError = 'El nombre del producto no puede estar vacío.';
      return false;
    }
    if (!this.formProducto.categoria || this.formProducto.categoria.trim() === '') {
      this.mensajeError = 'La categoría del producto no puede estar vacía.';
      return false;
    }
    if (this.formProducto.precio === null || this.formProducto.precio < 0) {
      this.mensajeError = 'El precio debe ser un número mayor o igual a 0.';
      return false;
    }
    if (this.formProducto.stock === null || this.formProducto.stock < 0) {
      this.mensajeError = 'El stock debe ser un número mayor o igual a 0.';
      return false;
    }

    this.mensajeError = null;
    return true;
  }

  async guardarProducto(): Promise<void> {
    if (!this.validarFormulario()) return;

    try {
      if (this.modoEdicion && this.idEdicion) {
        await this.productoService.actualizarProducto(this.idEdicion, this.formProducto);
      } else {
        await this.productoService.agregarProducto(this.formProducto);
      }

      this.limpiarFormulario();
    } catch (error) {
      this.mensajeError = 'Error al guardar el producto en Firestore.';
    }
  }

  seleccionarParaEditar(prod: Producto): void {
    if (!prod.id) return;
    this.modoEdicion = true;
    this.idEdicion = prod.id;
    this.formProducto = {
      nombre: prod.nombre,
      precio: prod.precio,
      stock: prod.stock,
      categoria: prod.categoria
    };
    this.mensajeError = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  async eliminarProducto(prod: Producto): Promise<void> {
    if (!prod.id) return;

    const confirmacion = window.confirm(`¿Está seguro que desea eliminar el producto "${prod.nombre}"?`);
    if (confirmacion) {
      try {
        await this.productoService.eliminarProducto(prod.id);
      } catch (error) {
        this.mensajeError = 'No se pudo eliminar el producto seleccionado.';
      }
    }
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.idEdicion = null;
    this.formProducto = { nombre: '', precio: 0, stock: 0, categoria: '' };
    this.mensajeError = null;
  }
}