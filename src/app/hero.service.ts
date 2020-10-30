import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log('fetched heroes.')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /**
   * GET hero by id. Will 404 if id not found.
   * @param id ID of hero to get.
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => this.log(`fetched hero id=${id}.`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**
   * POST: add a new hero to the server.
   * @param hero New hero details
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}.`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * PUT: update the hero on the server.
   * @param hero New Hero details
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(() => this.log(`updated hero id=${hero.id}.`)),
      catchError(this.handleError('updateHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id: number = typeof hero === 'number' ? hero : hero.id;
    return this.http.delete(`${this.heroesUrl}/${id}`, this.httpOptions).pipe(
      tap(() => this.log(`deleted hero w/ id=${id}.`)),
      catchError(this.handleError('deleteHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(
    operation: string = 'operation',
    result?: T
  ): (
    error: { message: string },
    caught: Observable<T>
  ) => ObservableInput<any> {
    return function(error: any): Observable<T> {
      // TODO: send the error to remote logging infrastructure.
      console.error(error); // log to console instead.

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }
}
