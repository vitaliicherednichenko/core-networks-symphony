import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TarjetasEmbarqueComponent } from './tarjetas-embarque.component';

describe('TarjetasEmbarqueComponent', () => {
  let component: TarjetasEmbarqueComponent;
  let fixture: ComponentFixture<TarjetasEmbarqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasEmbarqueComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetasEmbarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
