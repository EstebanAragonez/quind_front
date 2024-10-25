import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  // HttpParams agregado
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {

  private apiUrl = 'http://localhost:8080/api/solicitudes';
  private apiUrlDocumento = 'http://localhost:8080/api/documento';

  constructor(private http: HttpClient) { }

  // Obtener todas las solicitudes o filtradas por tipo de documento y número de documento
  obtenerSolicitudes(tipoDocumento: string, numeroDocumento: string): Observable<any> {
    // Usamos HttpParams para construir los parámetros de la consulta
    const params = new HttpParams()
      .set('tipoDocumento', tipoDocumento)
      .set('numeroDocumento', numeroDocumento);

    // Hacemos la llamada GET con los parámetros
    return this.http.get(`${this.apiUrl}`, { params });
  }

  // Crear una nueva solicitud
  crearSolicitud(solicitud: any): Observable<any> {
    return this.http.post(this.apiUrl, solicitud);
  }

  // Actualizar una solicitud
  actualizarSolicitud(id: number, estado: string, comentarios: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { estado, comentarios });
  }

  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDocumento);
  }
}
