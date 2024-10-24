import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizarSolicitudService {

  private apiUrl = 'http://localhost:8080/api/solicitudes';  // URL del backend

  constructor(private http: HttpClient) { }

  // Método para actualizar una solicitud
  actualizarSolicitud(id: number, estado: string, comentarios: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { estado, comentarios });
  }
}
