import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoraTable } from './zora-table';

describe('ZoraTable', () => {
  let component: ZoraTable;
  let fixture: ComponentFixture<ZoraTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoraTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoraTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
