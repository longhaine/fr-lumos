import { TestBed } from '@angular/core/testing';

import { FrLumosService } from './fr-lumos.service';

describe('FrLumosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrLumosService = TestBed.get(FrLumosService);
    expect(service).toBeTruthy();
  });
});
