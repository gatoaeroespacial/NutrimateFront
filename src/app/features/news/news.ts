import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface NewsItem {
    title: string;
    description: string;
    image: string;
    body: string;
    date: Date;
}

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule],
    templateUrl: './news.html',
    styleUrl: './news.scss'
})
export class News {
    newsItems: NewsItem[] = [
        {
            title: 'Beneficios del Ayuno Intermitente',
            description: 'Descubre cómo el ayuno intermitente puede mejorar tu salud metabólica y ayudarte a perder peso de manera sostenible.',
            image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            body: 'El ayuno intermitente no es una dieta, sino un patrón de alimentación. Estudios sugieren que puede mejorar la sensibilidad a la insulina, aumentar la energía y promover la longevidad. Existen varios métodos, como el 16/8 o el 5:2, que se adaptan a diferentes estilos de vida.',
            date: new Date('2023-10-25')
        },
        {
            title: 'Superalimentos para tu Cerebro',
            description: 'Incorpora estos alimentos a tu dieta diaria para potenciar tu concentración y memoria.',
            image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            body: 'Alimentos como los arándanos, el pescado graso rico en omega-3, la cúrcuma y el brócoli son excelentes para la salud cerebral. Contienen antioxidantes y nutrientes esenciales que protegen las neuronas y mejoran la función cognitiva a largo plazo.',
            date: new Date('2023-10-20')
        },
        {
            title: 'La Importancia de la Hidratación',
            description: 'Beber suficiente agua es vital para el funcionamiento óptimo de tu cuerpo. Aprende cuánto necesitas realmente.',
            image: 'https://images.unsplash.com/photo-1523362628408-3c7eda8fa83a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            body: 'El agua es esencial para regular la temperatura corporal, lubricar las articulaciones y transportar nutrientes. La deshidratación leve puede causar fatiga y dolores de cabeza. Se recomienda beber al menos 8 vasos al día, aunque las necesidades varían según la actividad física y el clima.',
            date: new Date('2023-10-15')
        },
        {
            title: 'Ejercicios de Fuerza vs. Cardio',
            description: '¿Cuál es mejor para ti? Analizamos los beneficios de cada uno para ayudarte a elegir.',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            body: 'El cardio es excelente para la salud cardiovascular y quemar calorías al instante, mientras que el entrenamiento de fuerza construye músculo y aumenta el metabolismo en reposo. La combinación ideal suele incluir ambos para obtener un estado físico completo y equilibrado.',
            date: new Date('2023-10-10')
        },
        {
            title: 'Recetas Saludables en 15 Minutos',
            description: 'No tienes tiempo para cocinar? Prueba estas recetas rápidas y nutritivas.',
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            body: 'Cocinar sano no tiene por qué ser complicado. Desde ensaladas completas hasta salteados de verduras con proteína, te presentamos opciones deliciosas que puedes preparar en menos de lo que tardas en pedir comida a domicilio.',
            date: new Date('2023-10-05')
        }
    ];
}
