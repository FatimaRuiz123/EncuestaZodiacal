import { TestBed } from '@angular/core/testing';

import { KmeansDataService } from './kmeans-data.service';

describe('KmeansDataService', () => {
  let service: KmeansDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmeansDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
