import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private coleccionNombre = 'productos';

  async obtenerProductos(): Promise<Producto[]> {
    const productosRef = collection(this.db, this.coleccionNombre);
    const snapshot = await getDocs(productosRef);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        nombre: data['nombre'] || data['Nombre'] || 'Sin nombre',
        precio: data['precio'] ?? 0,
        stock: data['stock'] ?? 0,
        categoria: data['categoria'] || data['Categoria'] || 'Sin categoría'
      } as Producto;
    });
  }

  async agregarProducto(producto: Omit<Producto, 'id'>): Promise<void> {
    const productosRef = collection(this.db, this.coleccionNombre);
    await addDoc(productosRef, producto);
  }

  async actualizarProducto(id: string, producto: Omit<Producto, 'id'>): Promise<void> {
    const docRef = doc(this.db, this.coleccionNombre, id);
    await updateDoc(docRef, { ...producto });
  }

  async eliminarProducto(id: string): Promise<void> {
    const docRef = doc(this.db, this.coleccionNombre, id);
    await deleteDoc(docRef);
  }
}