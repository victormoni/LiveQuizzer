import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCardComponent } from './question-card.component';

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
