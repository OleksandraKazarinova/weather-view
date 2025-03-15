import {inject, Injectable} from '@angular/core';
import {EMPTY, Observable, of, switchMap, tap} from 'rxjs';
import {ApiWeatherService} from './api/api-weather.service';
import {LonAndLatForSearchingCityInterface} from '../interfaces/lon-and-lat-for-searching-city.interface';
import {WeatherInterface} from '../interfaces/weather.interface';
import {HistoryDataByCityNameInterface, WeatherHistoryInterface} from '../interfaces/weather-history.interface';
import {REQUEST_THROTTLE_CONFIG} from '../configs/request-throttle.config';


@Injectable({providedIn:'root'})
export class WeatherService {
  private apiWeatherService = inject(ApiWeatherService);
  private readonly weatherHistoryKey = 'weatherHistory';

  getWeather(city: string, requestTime: number): Observable<WeatherInterface> {
    const cityFromHistory: HistoryDataByCityNameInterface | undefined = this.getWeatherFromLocalStorageByCityName(city);

   if (cityFromHistory && (requestTime - cityFromHistory.requestTime) < REQUEST_THROTTLE_CONFIG) {
     return of(cityFromHistory.weatherData);
    } else {
     return this.apiWeatherService
       .getLatAndLonForSearchingCity(city)
       .pipe(
         switchMap((response: LonAndLatForSearchingCityInterface[]) => {
           if (response.length) {
             return this.apiWeatherService
               .getWeather(response[0].lat, response[0].lon)
               .pipe(
                 tap((response) => {
                   const newWeatherHistory = this.createWeatherHistory(city, requestTime, response);
                   this.setWeatherHistoryToLocalStorage(newWeatherHistory);
                 })
               );
           }

           return EMPTY;
         })
       );
    }
  }

  private getWeatherHistoryFromLocalStorage(): WeatherHistoryInterface {
    const weatherHistory: string | null = localStorage.getItem(this.weatherHistoryKey);
    return weatherHistory ? JSON.parse(weatherHistory) as WeatherHistoryInterface : {};
  }

  private setWeatherHistoryToLocalStorage(weatherHistory: WeatherHistoryInterface): void {
    localStorage.setItem(this.weatherHistoryKey, JSON.stringify(weatherHistory));
  }

  private createWeatherHistory(cityName: string, requestTime: number, weatherData: WeatherInterface): WeatherHistoryInterface {
    const oldWeatherHistory = this.getWeatherHistoryFromLocalStorage();
    return {
      ...oldWeatherHistory,
      [cityName.toLowerCase().trim()]: {
        weatherData,
        requestTime
      }
    };
  }

  private getWeatherFromLocalStorageByCityName(city: string): HistoryDataByCityNameInterface | undefined {
    const oldWeatherHistory = this.getWeatherHistoryFromLocalStorage();
    return oldWeatherHistory[city.toLowerCase().trim()];
  }

}
