import { TestBed, inject } from '@angular/core/testing';

import { ListenerService } from './listener.service';

describe('ListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListenerService]
    });
  });

  it('should be created', inject([ListenerService], (service: ListenerService) => {
    expect(service).toBeTruthy();
  }));
});
