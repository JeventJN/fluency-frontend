import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  currentIndex = 0;

  testimonials = [
    {
      img: "assets/landing-page/landing-page-review-1.png",
      text: "“If not the best, it's one of the greatest platforms for us to meet with professional influencers and grow our brand beyond our expectation. Connect, Collaborate, and Grow could not be more easier without Fluency”",
      name: "Raffi Ahmad",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      img: "assets/landing-page/landing-page-review-2.png",
      text: "“Fluency has transformed the way we collaborate with influencers. The analytics and insights are a game-changer for our brand growth!”",
      name: "Park Ju Hyun",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      img: "assets/landing-page/landing-page-review-3.png",
      text: "“As an influencer, working with Fluency has been amazing. The projects are seamless, and payments are always on time!”",
      name: "Lee Su Hyun",
      rating: "⭐⭐⭐⭐⭐"
    }
  ]

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? this.testimonials.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.testimonials.length - 1) ? 0 : this.currentIndex + 1;
  }
}
