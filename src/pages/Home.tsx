import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';
import { api } from '@/lib/api';
import Autoplay from 'embla-carousel-autoplay';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts(6)
      .then((data) => setFeaturedProducts(data))
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const features = [
    {
      icon: 'Shield',
      title: 'Только оригинал',
      description: 'Все товары сертифицированы и проверены',
    },
    {
      icon: 'Truck',
      title: 'Быстрая доставка',
      description: 'Доставим по Вологде в день заказа',
    },
    {
      icon: 'Percent',
      title: 'Скидки постоянным клиентам',
      description: 'До 15% на следующие покупки',
    },
    {
      icon: 'Clock',
      title: 'Предзаказ',
      description: 'Закажите новинки до их появления',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight">
                Техника Apple
                <span className="block text-primary mt-2">в Вологде</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Новые и проверенные б/у устройства. Официальная гарантия и качество.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="gap-2">
                    <Icon name="Package" size={20} />
                    Смотреть каталог
                  </Button>
                </Link>
                <Link to="/contacts">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Icon name="MapPin" size={20} />
                    Наш адрес
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={20} className="text-primary" />
                  <a href="tel:+79211396943" className="text-lg font-medium hover:text-primary transition-colors">
                    +7 921 139-69-43
                  </a>
                </div>
              </div>
            </div>

            <div className="relative">
              <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full"
              >
                <CarouselContent>
                  {featuredProducts.slice(0, 4).map((product) => (
                    <CarouselItem key={product.id}>
                      <Card className="border-2 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-contain p-8"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                            <p className="text-3xl font-bold text-primary">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon name={feature.icon} size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Популярные товары</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Выбирайте из широкого ассортимента устройств Apple
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-6"
                    />
                    {product.condition === 'used' && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Б/У
                      </div>
                    )}
                    {product.condition === 'new' && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Новый
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <Link to={`/products`}>
                      <Button className="w-full gap-2">
                        <Icon name="Eye" size={18} />
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="gap-2">
                Смотреть все товары
                <Icon name="ArrowRight" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;