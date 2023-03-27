import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMultipleSelectComponent } from './menu-multiple-select.component';

describe('MenuMultipleSelectComponent', () => {
	let component: MenuMultipleSelectComponent;
	let fixture: ComponentFixture<MenuMultipleSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MenuMultipleSelectComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuMultipleSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
