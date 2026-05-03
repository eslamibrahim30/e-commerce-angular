import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoraModal } from './zora-modal';

describe('ZoraModal', () => {
  let component: ZoraModal;
  let fixture: ComponentFixture<ZoraModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoraModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoraModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
