import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { AppComponent } from './app.component';
import { TablaComponent } from './pages/tabla/tabla.component';
import { EntrenamientoComponent } from './pages/entrenamiento/entrenamiento.component';
import { ProbarAlgoritmoComponent } from './pages/probar-algoritmo/probar-algoritmo.component';

const routes: Routes = [
  {
    path: 'encuesta',
    component: EncuestaComponent
  },
  {
    path: 'datos',
    component: TablaComponent
  },
  {
    path: '',
    redirectTo: 'encuesta',
    pathMatch: 'full'
  },
  {
    path: 'entrenamiento',
    component: EntrenamientoComponent
  },
  {
    path: 'probarAlgoritmo',
    component: ProbarAlgoritmoComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
