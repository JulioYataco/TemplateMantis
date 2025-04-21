import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMantenimientosComponent } from './cita-mantenimientos.component';

describe('CitaMantenimientosComponent', () => {
  let component: CitaMantenimientosComponent;
  let fixture: ComponentFixture<CitaMantenimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMantenimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaMantenimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
