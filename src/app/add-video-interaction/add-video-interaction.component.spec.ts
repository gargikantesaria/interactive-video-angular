import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoInteractionComponent } from './add-video-interaction.component';

describe('AddVideoInteractionComponent', () => {
  let component: AddVideoInteractionComponent;
  let fixture: ComponentFixture<AddVideoInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVideoInteractionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
