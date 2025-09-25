export interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface OMDBSearchResponse {
  Search: OMDBSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface OMDBMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: 'movie' | 'series';
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
  totalSeasons?: string;
}

export interface WatchlistItem {
  id: string;
  title: string;
  year: string;
  type: 'movie' | 'series';
  poster: string;
  imdbID: string;
  addedAt: string;
  watched?: boolean;
}