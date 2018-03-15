import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryOutputComponent } from './entry-output.component';

describe('EntryOutputComponent', () => {
  let component: EntryOutputComponent;
  let fixture: ComponentFixture<EntryOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
