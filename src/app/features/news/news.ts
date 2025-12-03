import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewsService, NewsArticle } from './services/news.service';

interface NewsItem {
    title: string;
    description: string;
    image: string;
    body: string;
    date: Date;
    url?: string;
    source?: string;
}

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './news.html',
    styleUrl: './news.scss'
})
export class News implements OnInit {
    newsItems: NewsItem[] = [];
    loading = true;
    error = false;

    constructor(private newsService: NewsService) { }

    ngOnInit() {
        this.loadNews();
    }

    loadNews() {
        this.loading = true;
        this.error = false;
        console.log('🔄 Iniciando carga de noticias...');

        this.newsService.getNews().subscribe({
            next: (articles: NewsArticle[]) => {
                console.log('✅ Artículos recibidos:', articles);
                console.log('📊 Cantidad de artículos:', articles.length);

                if (!articles || articles.length === 0) {
                    console.warn('⚠️ No se recibieron artículos, usando datos de ejemplo');
                    this.loadMockNews();
                    this.loading = false;
                    return;
                }

                this.newsItems = articles.map(article => ({
                    title: article.title,
                    description: article.description || 'Sin descripción disponible',
                    image: article.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    body: article.description || '',
                    date: new Date(article.published_at),
                    url: article.url,
                    source: article.source?.name || 'Fuente desconocida'
                }));
                this.loading = false;
                console.log('✅ Noticias cargadas correctamente:', this.newsItems.length);
            },
            error: (err) => {
                console.error('❌ Error cargando noticias:', err);
                console.error('❌ Detalles del error:', err.message);
                this.error = true;
                this.loading = false;
                // Fallback to mock data
                this.loadMockNews();
            }
        });
    }

    loadMockNews() {
        this.newsItems = [
            {
                title: 'Beneficios del Ayuno Intermitente',
                description: 'Descubre cómo el ayuno intermitente puede mejorar tu salud metabólica y ayudarte a perder peso de manera sostenible.',
                image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                body: 'El ayuno intermitente no es una dieta, sino un patrón de alimentación. Estudios sugieren que puede mejorar la sensibilidad a la insulina, aumentar la energía y promover la longevidad.',
                date: new Date('2023-10-25')
            },
            {
                title: 'Superalimentos para tu Cerebro',
                description: 'Incorpora estos alimentos a tu dieta diaria para potenciar tu concentración y memoria.',
                image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                body: 'Alimentos como los arándanos, el pescado graso rico en omega-3, la cúrcuma y el brócoli son excelentes para la salud cerebral.',
                date: new Date('2023-10-20')
            },
            {
                title: 'La Importancia de la Hidratación',
                description: 'Beber suficiente agua es vital para el funcionamiento óptimo de tu cuerpo. Aprende cuánto necesitas realmente.',
                image: 'https://images.unsplash.com/photo-1523362628408-3c7eda8fa83a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                body: 'El agua es esencial para regular la temperatura corporal, lubricar las articulaciones y transportar nutrientes.',
                date: new Date('2023-10-15')
            }
        ];
    }

    openArticle(item: NewsItem) {
        if (item.url) {
            window.open(item.url, '_blank');
        }
    }
}
