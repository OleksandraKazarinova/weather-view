import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherIconPipeTs'
})
export class WeatherIconPipeTsPipe implements PipeTransform {

  transform(icon: string): string {
    const url = 'https://openweathermap.org/img/wn/';
    const imageExpansion = '@2x.png';

    return url + icon + imageExpansion;
  }

}
