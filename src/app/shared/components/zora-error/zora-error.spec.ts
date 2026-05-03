import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoraError } from './zora-error';

describe('ZoraError', () => {
  let component: ZoraError;
  let fixture: ComponentFixture<ZoraError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoraError],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoraError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
