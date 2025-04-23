import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMantenimientosAdminComponent } from './cita-mantenimientos-admin.component';

describe('CitaMantenimientosAdminComponent', () => {
  let component: CitaMantenimientosAdminComponent;
  let fixture: ComponentFixture<CitaMantenimientosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMantenimientosAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaMantenimientosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
