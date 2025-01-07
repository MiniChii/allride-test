import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}
  URL = 'https://maps.googleapis.com/maps/api/geocode';
  API_KEY = '';

  getGeocoding(address: string) {
    return this.http.get(
      `${this.URL}/json?address=${address}&key=${this.API_KEY}&region=cl`
    );
  }
}
