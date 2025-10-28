import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [phone, setPhone] = useState('');
  const [discountTier, setDiscountTier] = useState(0);
  const [phoneChecked, setPhoneChecked] = useState(false);

  const discountPercent = discountTier === 1 ? 5 : discountTier === 2 ? 10 : discountTier >= 3 ? 15 : 0;
  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const checkDiscount = async () => {
    if (!phone) {
      toast.error('Введите номер телефона');
      return;
    }

    try {
      const data = await api.checkDiscount(phone);
      setDiscountTier(data.discount_tier || 0);
      setPhoneChecked(true);
      if (data.discount_tier > 0) {
        toast.success(`Ваша скидка: ${discountPercent}%`);
      } else {
        toast.info('Скидка пока не доступна. Совершите покупку и получите бонус!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ошибка проверки скидки');
    }
  };

  const handleCheckout = async () => {
    if (!phone) {
      toast.error('Введите номер телефона');
      return;
    }

    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    try {
      await api.createOrder(
        phone,
        cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        discountPercent
      );
      toast.success('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
      clearCart();
      setPhone('');
      setPhoneChecked(false);
    } catch (err) {
      console.error(err);
      toast.error('Ошибка оформления заказа');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
            <Icon name="ShoppingCart" size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Корзина пуста</h2>
          <p className="text-muted-foreground text-lg">
            Добавьте товары из каталога
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              <Icon name="Package" size={20} />
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Корзина</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.condition === 'new' ? 'Новый' : 'Б/У'}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {item.product.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Icon name="Trash2" size={18} className="text-destructive" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Оформление заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Номер телефона</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 921 139-69-43"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneChecked(false);
                      }}
                    />
                    <Button onClick={checkDiscount} variant="outline">
                      <Icon name="Percent" size={18} />
                    </Button>
                  </div>
                  {phoneChecked && discountPercent > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Скидка постоянного клиента: {discountPercent}%
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товары:</span>
                    <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Скидка ({discountPercent}%):</span>
                      <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-primary">{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <Button className="w-full gap-2" size="lg" onClick={handleCheckout}>
                  <Icon name="Check" size={20} />
                  Оформить заказ
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Наш менеджер свяжется с вами для подтверждения заказа
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;