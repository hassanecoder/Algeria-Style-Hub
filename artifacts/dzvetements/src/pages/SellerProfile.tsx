import { useRoute } from "wouter";
import { useGetSeller, useGetSellerProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product/ProductCard";
import { MapPin, Star, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerProfile() {
  const [, params] = useRoute("/sellers/:id");
  const id = parseInt(params?.id || "0");

  const { data: seller, isLoading: isLoadingSeller } = useGetSeller(id, { query: { enabled: !!id } });
  const { data: productsData, isLoading: isLoadingProducts } = useGetSellerProducts(id, { limit: 20 }, { query: { enabled: !!id } });

  if (isLoadingSeller) return <div className="pt-32 min-h-screen text-center">Chargement...</div>;
  if (!seller) return <div className="pt-32 min-h-screen text-center">Vendeur introuvable</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Seller Header Card */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center text-4xl font-display font-bold text-primary overflow-hidden ring-4 ring-background shadow-xl">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
            ) : (
              seller.name.charAt(0)
            )}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{seller.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {seller.city}, {seller.wilaya}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Membre depuis {new Date(seller.joinedDate).getFullYear()}</span>
                  {seller.isVerified && <span className="text-emerald-600 font-medium flex items-center gap-1">✓ Vérifié</span>}
                </div>
              </div>
              <Button className="rounded-full px-6 shadow-md"><MessageCircle className="w-4 h-4 mr-2" /> Contacter</Button>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              {seller.bio || "Ce vendeur n'a pas encore ajouté de description."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background/50 rounded-2xl p-4 border border-border/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="font-display font-bold text-2xl flex items-center justify-center gap-1">
                  {seller.rating} <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Avis</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-2xl">{seller.productCount}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Articles</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-2xl">{seller.responseRate}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Rép. rapide</div>
              </div>
              <div className="text-center flex flex-col justify-center">
                <div className="text-sm font-medium text-emerald-600">Actif récemment</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller's Products */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
          Dressing de {seller.name} <span className="text-sm font-normal text-muted-foreground px-3 py-1 bg-muted rounded-full">{productsData?.total || 0} articles</span>
        </h2>
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-muted aspect-[3/4] rounded-2xl" />)}
          </div>
        ) : productsData?.products.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
            <p className="text-muted-foreground">Aucun article en vente pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productsData?.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
