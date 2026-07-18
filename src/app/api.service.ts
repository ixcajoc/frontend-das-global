import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal, Colaborador } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // private readonly baseUrl = 'http://localhost:3000/api'; //consumo api localhost
  private readonly baseUrl = 'https://backend-das-global.vercel.app/api';

  constructor(private http: HttpClient) {}

  uploadJson(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, data);
  }

  getSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.baseUrl}/sucursales`);
  }

  updateSucursal(
    id: number,
    data: { nombre: string; direccion: string; telefono: string }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/sucursales/${id}`, data);
  }

  deleteSucursal(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/sucursales/${id}`);
  }

  addColaborador(
    sucursalId: number,
    data: { nombre: string; cui: string }
  ): Observable<Colaborador> {
    return this.http.post<Colaborador>(
      `${this.baseUrl}/sucursales/${sucursalId}/colaboradores`,
      data
    );
  }

  updateColaborador(
    id: number,
    data: { nombre: string; cui: string }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/colaboradores/${id}`, data);
  }

  deleteColaborador(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/colaboradores/${id}`);
  }
}
