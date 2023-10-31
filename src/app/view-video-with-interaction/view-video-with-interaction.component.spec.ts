import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideoWithInteractionComponent } from './view-video-with-interaction.component';

describe('ViewVideoWithInteractionComponent', () => {
  let component: ViewVideoWithInteractionComponent;
  let fixture: ComponentFixture<ViewVideoWithInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewVideoWithInteractionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewVideoWithInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
