import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ListadoPasajerosVuelosComponent } from './listado-pasajeros-vuelos.component';

describe('ListadoPasajerosVuelosComponent', () => {
  let component: ListadoPasajerosVuelosComponent;
  let fixture: ComponentFixture<ListadoPasajerosVuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPasajerosVuelosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoPasajerosVuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
