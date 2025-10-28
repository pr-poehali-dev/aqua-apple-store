import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Order } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Orders = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    if (!phone) {
      toast.error('Введите номер телефона');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getOrders(phone);
      setOrders(data);
      if (data.length === 0) {
        toast.info('У вас пока нет заказов');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      pending: { label: 'Ожидает', variant: 'secondary' },
      confirmed: { label: 'Подтвержден', variant: 'default' },
      completed: { label: 'Выполнен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'outline' },
    };
    const config = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Мои покупки</h1>
          <p className="text-xl text-muted-foreground">
            История ваших заказов
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Поиск заказов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 921 139-69-43"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadOrders()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={loadOrders} disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={18} className="animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="Search" size={18} />
                      Найти
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Заказ №{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Клиент:</span>
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Телефон:</span>
                      <span className="font-medium">{order.customer_phone}</span>
                    </div>
                    {order.customer_email && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{order.customer_email}</span>
                      </div>
                    )}
                    {order.is_preorder && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={16} className="text-primary" />
                        <span className="text-primary font-medium">Предзаказ</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Итого:</p>
                        {order.discount_percent > 0 && (
                          <p className="text-xs text-green-600 mb-1">
                            Скидка: {order.discount_percent}%
                          </p>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {order.total_amount.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Icon name="ShoppingBag" size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Заказы не найдены</h3>
              <p className="text-muted-foreground">
                Введите номер телефона для поиска заказов
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;