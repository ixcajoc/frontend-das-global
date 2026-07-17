import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Sucursal, Colaborador } from '../models';

@Component({
  selector: 'app-sucursal-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursal-detail.component.html',
})
export class SucursalDetailComponent implements OnInit {
  sucursalId!: number;
  sucursal: Sucursal | null = null;

  // Formulario de sucursal
  form = { nombre: '', direccion: '', telefono: '' };

  loading = false;
  savingSucursal = false;
  error = '';
  successMsg = '';

  // Modal de colaborador
  showColaboradorModal = false;
  colaboradorEnEdicion: Colaborador | null = null;
  colaboradorForm = { nombre: '', cui: '' };
  savingColaborador = false;

  // Confirmación de eliminación de colaborador
  colaboradorAEliminar: Colaborador | null = null;
  deletingColaborador = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sucursalId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarSucursal();
  }

  cargarSucursal(): void {
    this.loading = true;
    this.error = '';
    this.api.getSucursales().subscribe({
      next: (data) => {
        const encontrada = data.find((s) => s.id === this.sucursalId) || null;
        this.sucursal = encontrada;
        if (encontrada) {
          this.form = {
            nombre: encontrada.nombre,
            direccion: encontrada.direccion,
            telefono: encontrada.telefono,
          };
        } else {
          this.error = 'No se encontró la sucursal solicitada.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la sucursal.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  flash(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 4000);
  }

  guardarSucursal(): void {
    if (!this.sucursal) return;
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre de la sucursal es obligatorio.';
      return;
    }
    this.savingSucursal = true;
    this.error = '';
    this.api.updateSucursal(this.sucursal.id, this.form).subscribe({
      next: () => {
        this.savingSucursal = false;
        this.flash('Cambios guardados correctamente.');
        this.cargarSucursal();
      },
      error: (err) => {
        this.savingSucursal = false;
        this.error = 'No se pudieron guardar los cambios.';
        console.error(err);
      },
    });
  }

  // ---- Colaboradores ----
  abrirNuevoColaborador(): void {
    this.colaboradorEnEdicion = null;
    this.colaboradorForm = { nombre: '', cui: '' };
    this.showColaboradorModal = true;
  }

  abrirEditarColaborador(c: Colaborador): void {
    this.colaboradorEnEdicion = c;
    this.colaboradorForm = { nombre: c.nombre, cui: c.cui };
    this.showColaboradorModal = true;
  }

  cerrarModal(): void {
    this.showColaboradorModal = false;
    this.colaboradorEnEdicion = null;
  }

  guardarColaborador(): void {
    if (!this.sucursal) return;
    if (!this.colaboradorForm.nombre.trim() || !this.colaboradorForm.cui.trim()) {
      this.error = 'El nombre y el CUI del colaborador son obligatorios.';
      return;
    }
    this.savingColaborador = true;
    this.error = '';

    if (this.colaboradorEnEdicion) {
      this.api
        .updateColaborador(this.colaboradorEnEdicion.id, this.colaboradorForm)
        .subscribe({
          next: () => {
            this.savingColaborador = false;
            this.cerrarModal();
            this.flash('Colaborador actualizado correctamente.');
            this.cargarSucursal();
          },
          error: (err) => {
            this.savingColaborador = false;
            this.error = 'No se pudo actualizar el colaborador.';
            console.error(err);
          },
        });
    } else {
      this.api.addColaborador(this.sucursal.id, this.colaboradorForm).subscribe({
        next: () => {
          this.savingColaborador = false;
          this.cerrarModal();
          this.flash('Colaborador agregado correctamente.');
          this.cargarSucursal();
        },
        error: (err) => {
          this.savingColaborador = false;
          this.error = 'No se pudo agregar el colaborador.';
          console.error(err);
        },
      });
    }
  }

  confirmarEliminarColaborador(c: Colaborador): void {
    this.colaboradorAEliminar = c;
  }

  cancelarEliminarColaborador(): void {
    this.colaboradorAEliminar = null;
  }

  eliminarColaborador(): void {
    if (!this.colaboradorAEliminar) return;
    this.deletingColaborador = true;
    this.api.deleteColaborador(this.colaboradorAEliminar.id).subscribe({
      next: () => {
        this.deletingColaborador = false;
        this.colaboradorAEliminar = null;
        this.flash('Colaborador eliminado correctamente.');
        this.cargarSucursal();
      },
      error: (err) => {
        this.deletingColaborador = false;
        this.colaboradorAEliminar = null;
        this.error = 'No se pudo eliminar el colaborador.';
        console.error(err);
      },
    });
  }
}
