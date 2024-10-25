import { Routes } from '@angular/router';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
  { path: 'solicitudes', component: SolicitudesComponent }
];
