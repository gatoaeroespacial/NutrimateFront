import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true
})
export class Navbar implements OnInit, OnDestroy {
  showOptions = true;
  private sub: Subscription | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkRoute(this.router.url);
    this.sub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private checkRoute(url: string) {
    const currentUrl = url.split('?')[0];
    this.showOptions = !['/login', '/register'].includes(currentUrl);
  }
}
