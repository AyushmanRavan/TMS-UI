import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryContentComponent } from './summary-content.component';

describe('SummaryContentComponent', () => {
  let component: SummaryContentComponent;
  let fixture: ComponentFixture<SummaryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
