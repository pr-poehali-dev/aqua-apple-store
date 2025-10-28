import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Contacts = () => {
  const contacts = [
    {
      icon: 'MapPin',
      title: 'Адрес',
      content: 'г. Вологда, ул. Каменный Мост, д. 6',
      action: 'Открыть на карте',
      link: 'https://yandex.ru/maps/?text=Вологда,%20ул.%20Каменный%20Мост,%20д.%206',
    },
    {
      icon: 'Phone',
      title: 'Телефон',
      content: '+7 921 139-69-43',
      action: 'Позвонить',
      link: 'tel:+79211396943',
    },
    {
      icon: 'Clock',
      title: 'Режим работы',
      content: 'Пн-Вс: 10:00 - 20:00',
      action: null,
      link: null,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Контакты</h1>
          <p className="text-xl text-muted-foreground">
            Приходите к нам в магазин или свяжитесь удобным способом
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contacts.map((contact, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon name={contact.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{contact.title}</h3>
                <p className="text-muted-foreground mb-4">{contact.content}</p>
                {contact.action && contact.link && (
                  <a href={contact.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      {contact.action}
                      <Icon name="ExternalLink" size={16} />
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.888889%2C59.220000&z=16&l=map&pt=39.888889,59.220000,pm2rdm"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              title="Карта"
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Посетите наш магазин</h2>
                <p className="text-muted-foreground mb-6">
                  Мы находимся в центре Вологды. Приезжайте посмотреть технику вживую,
                  проконсультироваться с нашими специалистами и сделать лучший выбор!
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={20} className="text-primary" />
                    <span>Протестируйте устройства перед покупкой</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={20} className="text-primary" />
                    <span>Получите профессиональную консультацию</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={20} className="text-primary" />
                    <span>Оформите покупку за 10 минут</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                        <Icon name="Car" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Парковка</h4>
                        <p className="text-sm text-muted-foreground">
                          Удобная парковка рядом с магазином
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                        <Icon name="CreditCard" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Способы оплаты</h4>
                        <p className="text-sm text-muted-foreground">
                          Наличные, карты, переводы
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;
