import { TablaComponent } from './pages/tabla/tabla.component';
import { Injectable } from '@angular/core';
import { KMeansResult } from './pages/tabla/tabla.component';

@Injectable({
  providedIn: 'root'
})
export class KmeansDataService {

  private kmeansResult: KMeansResult | null = null;

  setKmeansResult(result: KMeansResult): void {
    this.kmeansResult = result;
  }

  getKmeansResult(): KMeansResult | null {
    return this.kmeansResult;
  }
}
