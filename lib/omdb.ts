import { OMDBSearchResponse, OMDBMovieDetail } from './types';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

class OMDBService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OMDB_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OMDB API key not found in environment variables');
    }
  }

  private async makeRequest(params: Record<string, string>) {
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('OMDB API request failed:', error);
      throw error;
    }
  }

  async searchMovies(
    query: string,
    type?: 'movie' | 'series',
    year?: string,
    page: number = 1
  ): Promise<OMDBSearchResponse> {
    const params: Record<string, string> = {
      s: query,
      page: page.toString(),
    };

    if (type) {
      params.type = type;
    }

    if (year) {
      params.y = year;
    }

    return this.makeRequest(params);
  }

  async getMovieDetails(imdbID: string): Promise<OMDBMovieDetail> {
    const params = {
      i: imdbID,
      plot: 'full',
    };

    return this.makeRequest(params);
  }

  async getMovieByTitle(title: string, year?: string): Promise<OMDBMovieDetail> {
    const params: Record<string, string> = {
      t: title,
      plot: 'full',
    };

    if (year) {
      params.y = year;
    }

    return this.makeRequest(params);
  }
}

export const omdbService = new OMDBService();