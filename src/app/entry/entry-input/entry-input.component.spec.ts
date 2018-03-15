import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryInputComponent } from './entry-input.component';

describe('EntryInputComponent', () => {
  let component: EntryInputComponent;
  let fixture: ComponentFixture<EntryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
