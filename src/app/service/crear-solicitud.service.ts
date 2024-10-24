import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearSolicitudService {
  
  private apiUrlSolicitud = 'http://localhost:8080/api/tipo/solicitud';
  private apiUrlDocumento = 'http://localhost:8080/api/documento';

  constructor(private http: HttpClient) {}

  getTiposSolicitud(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlSolicitud);
  }

  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDocumento);
  }

  crearSolicitud(solicitud: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/solicitudes', solicitud);
  }
}
