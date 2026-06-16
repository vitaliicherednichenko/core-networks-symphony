import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PasajerosComponent } from './pasajeros.component';

describe('PasajerosComponent', () => {
  let component: PasajerosComponent;
  let fixture: ComponentFixture<PasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasajerosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
