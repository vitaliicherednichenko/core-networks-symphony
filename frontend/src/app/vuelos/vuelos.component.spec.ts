import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { VuelosComponent } from './vuelos.component';

describe('VuelosComponent', () => {
  let component: VuelosComponent;
  let fixture: ComponentFixture<VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VuelosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
