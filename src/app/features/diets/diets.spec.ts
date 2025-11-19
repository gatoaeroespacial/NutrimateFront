import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diets } from './diets';

describe('Diets', () => {
  let component: Diets;
  let fixture: ComponentFixture<Diets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
