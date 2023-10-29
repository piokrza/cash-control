import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, combineLatest, finalize, tap } from 'rxjs';

import { WeatherApi, WeatherService, WeatherState } from '#features/weather/data-access';
import { WeatherDataset, WeatherResponse } from '#features/weather/models';

@Injectable()
export class WeatherFacade {
  private readonly weatherApi: WeatherApi = inject(WeatherApi);
  private readonly weatherState: WeatherState = inject(WeatherState);
  private readonly weatherService: WeatherService = inject(WeatherService);

  public get weatherDataset$(): Observable<WeatherDataset> {
    return combineLatest({
      data: this.weatherState.weatherData$,
      isLoading: this.weatherState.isLoading$,
    });
  }

  public loadWeatherDataByCity$(cityName: string) {
    this.weatherState.setIsLoading(true);

    return this.weatherApi.searchByCityName$(cityName).pipe(
      tap((data: WeatherResponse) => this.weatherState.setWeatherData(data)),
      catchError((): Observable<never> => EMPTY),
      finalize((): void => this.weatherState.setIsLoading(false))
    );
  }
}
