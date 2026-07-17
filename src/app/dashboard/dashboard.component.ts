import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Sucursal } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  sucursales: Sucursal[] = [];
  loading = false;
  uploading = false;
  error = '';
  successMsg = '';

  // Estado de confirmación de eliminación
  sucursalAEliminar: Sucursal | null = null;
  deleting = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarSucursales();
  }

  cargarSucursales(): void {
    this.loading = true;
    this.error = '';
    this.api.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          'No se pudieron cargar las sucursales. Verifica que el servidor esté disponible.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.error = '';
    this.successMsg = '';

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.subirJson(json);
      } catch (e) {
        this.error = 'El archivo seleccionado no es un JSON válido.';
      }
      input.value = '';
    };
    reader.onerror = () => {
      this.error = 'Ocurrió un error al leer el archivo.';
      input.value = '';
    };
    reader.readAsText(file);
  }

  subirJson(json: any): void {
    this.uploading = true;
    this.api.uploadJson(json).subscribe({
      next: (res) => {
        this.uploading = false;
        this.successMsg = 'Archivo cargado correctamente.';
        this.cargarSucursales();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err) => {
        this.uploading = false;
        this.error =
          'No se pudo cargar el archivo. Verifica el formato del JSON.';
        console.error(err);
      },
    });
  }

  verEditar(s: Sucursal): void {
    this.router.navigate(['/sucursales', s.id]);
  }

  confirmarEliminar(s: Sucursal): void {
    this.sucursalAEliminar = s;
  }

  cancelarEliminar(): void {
    this.sucursalAEliminar = null;
  }

  eliminarSucursal(): void {
    if (!this.sucursalAEliminar) return;
    this.deleting = true;
    const id = this.sucursalAEliminar.id;
    this.api.deleteSucursal(id).subscribe({
      next: () => {
        this.deleting = false;
        this.sucursalAEliminar = null;
        this.successMsg = 'Sucursal eliminada correctamente.';
        this.cargarSucursales();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err) => {
        this.deleting = false;
        this.error = 'No se pudo eliminar la sucursal.';
        this.sucursalAEliminar = null;
        console.error(err);
      },
    });
  }
}
