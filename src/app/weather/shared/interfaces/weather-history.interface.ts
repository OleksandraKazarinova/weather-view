import {WeatherInterface} from './weather.interface';

export interface WeatherHistoryInterface {
  [key: string]: HistoryDataByCityNameInterface;
}

export interface HistoryDataByCityNameInterface {
  weatherData: WeatherInterface;
  requestTime: number;
}
