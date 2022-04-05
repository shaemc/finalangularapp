import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Movie } from "../movie.model";
import { MoviesService } from "../movies.service";

@Component({
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  styleUrls: ["./movie-list.component.css"]
})
export class MovieListComponent implements OnInit, OnDestroy {
  // movies = [
  //   { title: "First Post", content: "This is the first movie's content" },
  //   { title: "Second Post", content: "This is the second movie's content" },
  //   { title: "Third Post", content: "This is the third movie's content" }
  // ];
  movies: Movie[] = [];
  isLoading = false;
  private moviesSub: Subscription;

  constructor(public moviesService: MoviesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.moviesService.getMovies();
    this.moviesSub = this.moviesService.getMovieUpdateListener()
      .subscribe((movies: Movie[]) => {
        this.isLoading = false;
        this.movies = movies;
      });
  }

  onDelete(movieId: string) {
    this.moviesService.deleteMovie(movieId);
  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }
}
