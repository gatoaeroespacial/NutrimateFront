import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DietHistory } from '../../../shared/models/diet-history';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    constructor(private apiService: ApiService) { }

    /**
     * Get diet history from backend
     * Optional query parameters: startDate, endDate
     */
    getDietHistory(startDate?: string, endDate?: string): Observable<DietHistory[]> {
        let endpoint = '/users/historical/';
        const params: string[] = [];

        if (startDate) {
            params.push(`startDate=${startDate}`);
        }
        if (endDate) {
            params.push(`endDate=${endDate}`);
        }

        if (params.length > 0) {
            endpoint += '?' + params.join('&');
        }

        return this.apiService.get<DietHistory[]>(endpoint);
    }
}
