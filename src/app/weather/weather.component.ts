import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe, DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {WeatherService} from './shared/services/weather.service';
import {WeatherInterface} from './shared/interfaces/weather.interface';
import {WeatherIconPipeTsPipe} from './shared/pipes/weather-icon.pipe.ts.pipe';

@Component({
  selector: 'app-weather',
  imports: [
    FormsModule,
    AsyncPipe,
    WeatherIconPipeTsPipe,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  city = signal('');
  today = signal(new Date());
  loadWeatherDataByCity$!: Observable<WeatherInterface>;

  ngOnInit() {

  }

  updateCity(event: Event) {
    const inputName = event.target as HTMLInputElement;
    this.city.set(inputName.value.trim());
  }

  searchWeather() {
    const currentCity = this.city();

    if (currentCity) {
      this.today.set(new Date());
      this.loadWeatherDataByCity$ = this.weatherService.getWeather(currentCity);
    }
  }
}
