import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgModalComponent } from './msg-modal.component';

describe('MsgModalComponent', () => {
  let component: MsgModalComponent;
  let fixture: ComponentFixture<MsgModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
