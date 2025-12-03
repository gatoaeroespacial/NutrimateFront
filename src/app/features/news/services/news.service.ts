import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    image_url: string;
    published_at: string;
    source: {
        name: string;
        url: string;
    };
}

export interface NewsResponse {
    status?: string;
    data?: NewsArticle[];
    articles?: NewsArticle[];
    results?: NewsArticle[];
    meta?: {
        found: number;
        returned: number;
        limit: number;
        page: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    constructor(private apiService: ApiService) { }

    getNews(titles?: string[]): Observable<NewsArticle[]> {
        let url = '/news/news/';

        // Add title filters if provided
        if (titles && titles.length > 0) {
            const params = new URLSearchParams();
            titles.forEach(title => params.append('title', title));
            url += '?' + params.toString();
        }

        return this.apiService.get<any>(url).pipe(
            tap(response => {
                console.log('📰 Respuesta completa de la API:', response);
                console.log('📰 Tipo de respuesta:', typeof response);
                console.log('📰 Claves de la respuesta:', Object.keys(response || {}));
            }),
            map(response => {
                // Handle different response structures
                if (Array.isArray(response)) {
                    console.log('✅ Respuesta es array directo, artículos:', response.length);
                    return response;
                }

                // Try different possible data properties
                if (response) {
                    if (response.data && Array.isArray(response.data)) {
                        console.log('✅ Respuesta tiene propiedad data, artículos:', response.data.length);
                        return response.data;
                    } else if (response.articles && Array.isArray(response.articles)) {
                        console.log('✅ Respuesta tiene propiedad articles, artículos:', response.articles.length);
                        return response.articles;
                    } else if (response.results && Array.isArray(response.results)) {
                        console.log('✅ Respuesta tiene propiedad results, artículos:', response.results.length);
                        return response.results;
                    }
                }

                console.warn('⚠️ Estructura de respuesta inesperada, no se encontraron artículos');
                console.warn('⚠️ Respuesta recibida:', response);
                return [];
            })
        );
    }
}
