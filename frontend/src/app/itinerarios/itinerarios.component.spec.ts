import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ItinerariosComponent } from './itinerarios.component';

describe('ItinerariosComponent', () => {
  let component: ItinerariosComponent;
  let fixture: ComponentFixture<ItinerariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerariosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ItinerariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
