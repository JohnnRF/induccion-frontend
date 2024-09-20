import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private http: HttpClient) { }

  private baseUrl: string = `${environment.baseUrl}/api/bodega`;

  getApiCategories(){
    return this.http.get<any>(this.baseUrl);
  }
}
