import { Link } from "wouter";
import { ArrowRight, ShoppingBag, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { useListProducts, useGetStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ 
    featured: true, 
    limit: 4 
  });
  
  const { data: newProducts } = useListProducts({ 
    sort: "newest", 
    limit: 8 
  });

  const { data: stats } = useGetStats();

  const categories = [
    { name: "Femmes", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" },
    { name: "Hommes", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800" },
    { name: "Traditionnel", image: "https://images.unsplash.com/photo-1596455607563-ad6193f78b78?auto=format&fit=crop&q=80&w=800" },
    { name: "Accessoires", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-pattern.png`} 
            alt="Pattern" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-balance mb-6 text-foreground">
              Achetez et vendez la <span className="text-primary italic font-serif">mode</span> en Algérie.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Découvrez des milliers de pièces uniques, des marques internationales aux tenues traditionnelles, livrées dans les 58 wilayas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Acheter maintenant
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-2 hover:bg-muted w-full sm:w-auto">
                  Vendre mes articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="bg-primary text-primary-foreground py-8 my-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8 divide-x divide-primary-foreground/20 text-center">
            <div>
              <div className="font-display font-bold text-3xl mb-1">{stats?.totalProducts || "10k+"}</div>
              <div className="text-sm text-primary-foreground/70 uppercase tracking-wider">Articles en ligne</div>
            </div>
            <div>
              <div className="font-display font-bold text-3xl mb-1">{stats?.totalSellers || "2.5k"}</div>
              <div className="text-sm text-primary-foreground/70 uppercase tracking-wider">Vendeurs actifs</div>
            </div>
            <div>
              <div className="font-display font-bold text-3xl mb-1">{stats?.totalWilayas || "58"}</div>
              <div className="text-sm text-primary-foreground/70 uppercase tracking-wider">Wilayas desservies</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ShieldCheck className="w-8 h-8 mb-2 text-accent" />
              <div className="text-sm text-primary-foreground/70 uppercase tracking-wider">Paiement sécurisé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Explorer</h2>
            <p className="text-muted-foreground">Trouvez ce qui vous correspond</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}>
              <div className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-white font-display font-bold text-2xl drop-shadow-md">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold mb-1">Tendances</h2>
              <p className="text-muted-foreground">Les articles les plus convoités</p>
            </div>
          </div>
          <Link href="/products?featured=true" className="text-primary font-medium hover:underline flex items-center gap-1 hidden sm:flex">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-muted aspect-[4/5] rounded-2xl" />
                <div className="h-4 bg-muted w-3/4 rounded" />
                <div className="h-4 bg-muted w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts?.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="z-10 max-w-xl">
            <Badge className="bg-accent text-white border-none mb-6">Nouveau</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
              Vendez ce que vous ne portez plus.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Donnez une seconde vie à vos vêtements et gagnez de l'argent. C'est simple, rapide et gratuit.
            </p>
            <Link href="/sell">
              <Button size="lg" className="rounded-full h-14 px-8 shadow-lg">
                Commencer à vendre
              </Button>
            </Link>
          </div>
          <div className="z-10 w-full max-w-md">
            {/* landing page sell banner abstract fashion */}
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
              alt="Vendre" 
              className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Nouveautés</h2>
              <p className="text-muted-foreground">Tout juste ajoutés</p>
            </div>
            <Link href="/products?sort=newest" className="text-primary font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newProducts?.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
