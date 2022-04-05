import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { MoviesService } from "../movies.service";
import { Movie } from "../movie.model";

@Component({
  selector: "app-movie-create",
  templateUrl: "./movie-create.component.html",
  styleUrls: ["./movie-create.component.css"]
})
export class MovieCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  movie: Movie;
  isLoading = false;
  private mode = "create";
  private movieId: string;

  constructor(
    public moviesService: MoviesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("movieId")) {
        this.mode = "edit";
        this.movieId = paramMap.get("movieId");
        this.isLoading = true;
        this.moviesService.getMovie(this.movieId).subscribe(movieData => {
          this.isLoading = false;
          this.movie = {id: movieData._id, title: movieData.title, content: movieData.content};
        });
      } else {
        this.mode = "create";
        this.movieId = null;
      }
    });
  }

  onSaveMovie(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.moviesService.addMovie(form.value.title, form.value.content);
    } else {
      this.moviesService.updateMovie(
        this.movieId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
