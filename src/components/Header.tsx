import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: 'Home' },
    { path: '/products', label: 'Продукция', icon: 'Package' },
    { path: '/reviews', label: 'Отзывы', icon: 'Star' },
    { path: '/contacts', label: 'Контакты', icon: 'MapPin' },
    { path: '/orders', label: 'Мои покупки', icon: 'ShoppingBag' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="https://cdn.poehali.dev/files/a4bcc9a6-ab35-4407-877b-1a58f40efa42.png" 
            alt="AquaApple" 
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Button>
            </Link>
          ))}
          <Link to="/cart">
            <Button variant={isActive('/cart') ? 'default' : 'outline'} className="gap-2 relative">
              <Icon name="ShoppingCart" size={18} />
              Корзина
              {getCartCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <Icon name="ShoppingCart" size={20} />
              {getCartCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Icon name="Menu" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <Icon name={item.icon} size={18} />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
