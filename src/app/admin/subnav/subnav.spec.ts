import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subnav } from './subnav';

describe('Subnav', () => {
  let component: Subnav;
  let fixture: ComponentFixture<Subnav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subnav],
    }).compileComponents();

    fixture = TestBed.createComponent(Subnav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
