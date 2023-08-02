
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class KmeansDataService {

  points: number[][] | any; // Esta propiedad almacenará los datos filtrados

}
