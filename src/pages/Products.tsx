import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preorderOpen, setPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filter === 'all') return true;
    return p.condition === filter;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handlePrintPDF = (product: Product) => {
    const printContent = `
      <html>
        <head>
          <title>${product.name} - AquaApple</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #60A5FA; }
            .info { margin: 20px 0; }
            .price { font-size: 24px; font-weight: bold; color: #60A5FA; }
          </style>
        </head>
        <body>
          <h1>AquaApple - ${product.name}</h1>
          <div class="info">
            <p><strong>Категория:</strong> ${product.category}</p>
            <p><strong>Состояние:</strong> ${product.condition === 'new' ? 'Новый' : 'Б/У'}</p>
            <p><strong>Описание:</strong> ${product.description}</p>
            <p class="price">Цена: ${product.price.toLocaleString('ru-RU')} ₽</p>
          </div>
          <p><strong>Адрес:</strong> г.Вологда, ул. Каменный Мост, д. 6</p>
          <p><strong>Телефон:</strong> +7 921 139-69-43</p>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePreorder = (product: Product) => {
    setPreorderProduct(product);
    setPreorderOpen(true);
  };

  const submitPreorder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Предзаказ оформлен! Мы свяжемся с вами в ближайшее время.');
    setPreorderOpen(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Каталог продукции</h1>
          <p className="text-xl text-muted-foreground">
            Новая и проверенная б/у техника Apple
          </p>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">Все товары</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
            <TabsTrigger value="used">Б/У</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all">
                  <CardContent className="p-0">
                    <div
                      className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 relative cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain p-6"
                      />
                      <Badge
                        className="absolute top-4 left-4"
                        variant={product.condition === 'new' ? 'default' : 'secondary'}
                      >
                        {product.condition === 'new' ? 'Новый' : 'Б/У'}
                      </Badge>
                      {product.stock <= 3 && product.stock > 0 && (
                        <Badge className="absolute top-4 right-4 bg-orange-500">
                          Осталось {product.stock} шт
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge className="absolute top-4 right-4 bg-red-500">
                          Нет в наличии
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-2"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <Icon name="ShoppingCart" size={18} />
                          В корзину
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Icon name="Eye" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.category}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Badge variant={selectedProduct.condition === 'new' ? 'default' : 'secondary'}>
                    {selectedProduct.condition === 'new' ? 'Новый' : 'Б/У'}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {selectedProduct.price.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Package" size={16} />
                  <span>В наличии: {selectedProduct.stock} шт</span>
                </div>
                <div className="space-y-2 pt-4">
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                  >
                    <Icon name="ShoppingCart" size={18} />
                    Добавить в корзину
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handlePreorder(selectedProduct)}
                  >
                    <Icon name="Clock" size={18} />
                    Оформить предзаказ
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handlePrintPDF(selectedProduct)}
                  >
                    <Icon name="FileText" size={18} />
                    Печать PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={preorderOpen} onOpenChange={setPreorderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оформить предзаказ</DialogTitle>
            <DialogDescription>
              {preorderProduct?.name} - {preorderProduct?.price.toLocaleString('ru-RU')} ₽
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPreorder} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input id="name" required placeholder="Ваше имя" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" required placeholder="+7 921 139-69-43" />
            </div>
            <div>
              <Label htmlFor="email">Email (опционально)</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Icon name="Check" size={18} />
              Оформить предзаказ
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;