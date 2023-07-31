import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbarAlgoritmoComponent } from './probar-algoritmo.component';

describe('ProbarAlgoritmoComponent', () => {
  let component: ProbarAlgoritmoComponent;
  let fixture: ComponentFixture<ProbarAlgoritmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbarAlgoritmoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbarAlgoritmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
