import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BravoEditorComponent } from './bravo-editor.component';

describe('BravoEditorComponent', () => {
  let component: BravoEditorComponent;
  let fixture: ComponentFixture<BravoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BravoEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BravoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
