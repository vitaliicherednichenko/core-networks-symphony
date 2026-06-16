import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BoletosComponent } from './boletos.component';

describe('BoletosComponent', () => {
  let component: BoletosComponent;
  let fixture: ComponentFixture<BoletosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
