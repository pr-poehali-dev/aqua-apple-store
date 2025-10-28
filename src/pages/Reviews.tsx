import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Review } from '@/types';
import { api } from '@/lib/api';

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.getReviews()
      .then((data) => setReviews(data))
      .catch((err) => console.error('Error loading reviews:', err));
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={20}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map((p) => p[0]).join('').toUpperCase();
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Отзывы клиентов</h1>
          <p className="text-xl text-muted-foreground">
            Что говорят о нас наши покупатели
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold text-primary mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
            <p className="text-muted-foreground">На основе {reviews.length} отзывов</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(review.customer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{review.customer_name}</h3>
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} className="text-primary" />
                        <span className="text-xs text-muted-foreground">Яндекс.Карты</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Оставьте свой отзыв</h3>
            <p className="text-muted-foreground mb-6">
              После покупки мы будем рады вашему мнению на Яндекс.Картах
            </p>
            <a
              href="https://yandex.ru/maps/org/aquaapple/search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Icon name="ExternalLink" size={20} />
              Открыть на Яндекс.Картах
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reviews;