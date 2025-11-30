import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HistoryService } from './services/history.service';
import { DietHistory } from '../../shared/models/diet-history';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  history: DietHistory[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.historyService.getDietHistory().subscribe(data => {
      this.history = data;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
