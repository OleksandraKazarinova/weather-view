import {inject, Injectable} from '@angular/core';
import {EMPTY, Observable, switchMap} from 'rxjs';
import {ApiWeatherService} from './api/api-weather.service';
import {LonAndLatForSearchingCityInterface} from '../interfaces/lon-and-lat-for-searching-city.interface';
import {WeatherInterface} from '../interfaces/weather.interface';


@Injectable({providedIn:'root'})
export class WeatherService {
  private apiWeatherService = inject(ApiWeatherService);

  getWeather(city: string): Observable<WeatherInterface> {
    return this.apiWeatherService
      .getLatAndLonForSearchingCity(city)
      .pipe(
        switchMap((response: LonAndLatForSearchingCityInterface[]) => {
          if (response.length) {
            return this.apiWeatherService.getWeather(response[0].lat, response[0].lon);
          }

         return EMPTY;
        })
      )
  }
}
