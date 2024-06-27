import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatToolbarModule,
        MatTabsModule,
        NoopAnimationsModule,
        AppComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router.initialNavigation();
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'calendar-app'`, () => {
    expect(component.title).toEqual('calendar-app');
  });

  it('should render title in a mat-toolbar', () => {
    const compiled = fixture.nativeElement;
    const toolbar = compiled.querySelector('mat-toolbar span');
    expect(toolbar.textContent).toContain('My Calendar App');
  });

  it('should have a router-outlet', () => {
    const debugElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(debugElement).not.toBeNull();
  });

  it('should have links to calendar and add-appointment', () => {
    const debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    const links = debugElements.map(de => de.attributes['routerLink']);
    expect(links).toContain('/calendar');
    expect(links).toContain('/add-appointment');
  });

  it('should navigate to calendar on clicking the calendar tab', async () => {
    const calendarLink = fixture.debugElement.query(By.css('a[routerLink="/calendar"]')).nativeElement;
    calendarLink.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/calendar');
  });

  it('should navigate to add-appointment on clicking the add-appointment tab', async () => {
    const addAppointmentLink = fixture.debugElement.query(By.css('a[routerLink="/add-appointment"]')).nativeElement;
    addAppointmentLink.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/add-appointment');
  });
});
