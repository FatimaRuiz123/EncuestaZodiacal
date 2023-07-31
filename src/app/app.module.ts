import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { TablaComponent } from './pages/tabla/tabla.component';
import { NavComponent } from './pages/nav/nav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FilterPipe } from './pages/tabla/filter.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntrenamientoComponent } from './pages/entrenamiento/entrenamiento.component';
import { ProbarAlgoritmoComponent } from './pages/probar-algoritmo/probar-algoritmo.component';


@NgModule({
  declarations: [
    AppComponent,
    EncuestaComponent,
    TablaComponent,
    NavComponent,
    FilterPipe,
    EntrenamientoComponent,
    ProbarAlgoritmoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatRadioModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
