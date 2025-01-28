import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class HomeComponent {
  constructor(private viewportScroller: ViewportScroller) {}
  scrollToAbout() {
    // const aboutSection = document.getElementById('About');
    // aboutSection?.scrollIntoView({ behavior: 'smooth' });
    this.viewportScroller.scrollToAnchor('about');
  }
}