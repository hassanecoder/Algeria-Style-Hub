import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, User, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@workspace/api-client-react";
import { useCartSession } from "@/hooks/use-cart-session";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const sessionId = useCartSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cart } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, staleTime: 0 } }
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl group-hover:rotate-12 transition-transform duration-300 shadow-md">
              Dz
            </div>
            <span className="font-display font-bold text-2xl tracking-tight hidden sm:block text-foreground">
              Vêtements
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Chercher des vêtements, marques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <Link href="/sell">
              <Button
                variant="outline"
                className="hidden sm:flex rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                <PlusCircle className="w-4 h-4" />
                Vendre
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-black/5"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart?.itemCount ? (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in">
                    {cart.itemCount}
                  </span>
                ) : null}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden sm:flex hover:bg-black/5"
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-4 pb-6 flex flex-col"
          >
            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Chercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border bg-muted/50 focus:bg-background focus:border-primary outline-none text-lg"
              />
            </form>

            <div className="flex flex-col gap-4 text-xl font-display font-medium">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                Tous les produits
              </Link>
              <Link href="/products?category=Femmes" onClick={() => setMobileMenuOpen(false)}>
                Femmes
              </Link>
              <Link href="/products?category=Hommes" onClick={() => setMobileMenuOpen(false)}>
                Hommes
              </Link>
              <Link href="/products?category=Traditionnel" onClick={() => setMobileMenuOpen(false)}>
                Traditionnel (Haïk, Burnous)
              </Link>
              <div className="h-px bg-border my-2" />
              <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="text-primary flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Vendre un article
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
