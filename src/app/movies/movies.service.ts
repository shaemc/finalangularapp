import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Movie } from "./movie.model";

@Injectable({ providedIn: "root" })
export class MoviesService {
  private movies: Movie[] = [];
  private moviesUpdated = new Subject<Movie[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getMovies() {
    this.http
      .get<{ message: string; movies: any }>("http://localhost:3000/api/movies")
      .pipe(
        map(movieData => {
          return movieData.movies.map(movie => {
            return {
              title: movie.title,
              content: movie.content,
              id: movie._id
            };
          });
        })
      )
      .subscribe(transformedMovies => {
        this.movies = transformedMovies;
        this.moviesUpdated.next([...this.movies]);
      });
  }

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  getMovie(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/movies/" + id
    );
  }

  addMovie(title: string, content: string) {
    const movie: Movie = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; movieId: string }>(
        "http://localhost:3000/api/movies",
        movie
      )
      .subscribe(responseData => {
        const id = responseData.movieId;
        movie.id = id;
        this.movies.push(movie);
        this.moviesUpdated.next([...this.movies]);
        this.router.navigate(["/"]);
      });
  }

  updateMovie(id: string, title: string, content: string) {
    const movie: Movie = { id: id, title: title, content: content };
    this.http
      .put("http://localhost:3000/api/movies/" + id, movie)
      .subscribe(response => {
        const updatedMovies = [...this.movies];
        const oldMovieIndex = updatedMovies.findIndex(p => p.id === movie.id);
        updatedMovies[oldMovieIndex] = movie;
        this.movies = updatedMovies;
        this.moviesUpdated.next([...this.movies]);
        this.router.navigate(["/"]);
      });
  }

  deleteMovie(movieId: string) {
    this.http
      .delete("http://localhost:3000/api/movies/" + movieId)
      .subscribe(() => {
        const updatedMovies = this.movies.filter(movie => movie.id !== movieId);
        this.movies = updatedMovies;
        this.moviesUpdated.next([...this.movies]);
      });
  }
}
