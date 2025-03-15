import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LonAndLatForSearchingCityInterface} from '../../interfaces/lon-and-lat-for-searching-city.interface';
import {WeatherInterface} from '../../interfaces/weather.interface';

@Injectable({providedIn:'root'})
export class ApiWeatherService {
  private readonly apiKey = '57b26f5259086706e70224926b33ce85';
  private httpClient  = inject(HttpClient);


  getWeather(lat: number, lon: number): Observable<WeatherInterface> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('lat', lat);
    httpParams = httpParams.append('lon', lon);
    httpParams = httpParams.append('appid', this.apiKey);
    httpParams = httpParams.append('units', 'metric');

    return this.httpClient.get<WeatherInterface>('https://api.openweathermap.org/data/2.5/weather', {
      params: httpParams
    })
  }


  getLatAndLonForSearchingCity(city: string): Observable<LonAndLatForSearchingCityInterface[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('q', city);
    httpParams = httpParams.append('limit', 1);
    httpParams = httpParams.append('appid', this.apiKey);

    return this.httpClient.get<LonAndLatForSearchingCityInterface[]>(
      'http://api.openweathermap.org/geo/1.0/direct', {
        params: httpParams
      }
    );
  }
}
