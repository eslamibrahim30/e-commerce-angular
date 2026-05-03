import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoraLoader } from './zora-loader';

describe('ZoraLoader', () => {
  let component: ZoraLoader;
  let fixture: ComponentFixture<ZoraLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoraLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoraLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
