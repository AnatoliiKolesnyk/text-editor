import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SynonymsService {
  private baseURL = 'https://api.datamuse.com/words';

  constructor(
    private httpClient: HttpClient
  ) {}

  getSynonyms(word: string): Observable<string[]> {
    return this.httpClient
      .get<{ word: string }[]>(this.baseURL, {
        observe: 'body',
        params: new HttpParams().set('ml', word),
      })
      .pipe(
        map(wordsData => {
          return wordsData
            .slice(0, 3)
            .map(wordData => wordData.word);
        })
      );
  }
}
