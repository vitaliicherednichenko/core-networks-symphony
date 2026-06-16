import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { DetallesViajerosComponent } from './detalles-viajeros.component';

describe('DetallesViajerosComponent', () => {
  let component: DetallesViajerosComponent;
  let fixture: ComponentFixture<DetallesViajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesViajerosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesViajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
