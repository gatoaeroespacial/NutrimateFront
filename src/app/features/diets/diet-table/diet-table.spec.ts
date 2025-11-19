import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietTable } from './diet-table';

describe('DietTable', () => {
  let component: DietTable;
  let fixture: ComponentFixture<DietTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietTable]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
