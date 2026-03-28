import { useState } from "react";
import { useRoute } from "wouter";
import { formatPrice, CONDITIONS } from "@/lib/utils";
import { useGetProduct, useAddToCart } from "@workspace/api-client-react";
import { useCartSession } from "@/hooks/use-cart-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Truck, ArrowLeft, Star, ShoppingBag, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { getGetCartQueryKey } from "@workspace/api-client-react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const { data: product, isLoading, error } = useGetProduct(id, {
    query: { enabled: !!id }
  });

  const { mutate: addToCart, isPending } = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    }
  });

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length && !selectedSize) {
      alert("Veuillez choisir une taille");
      return;
    }
    
    addToCart({
      data: {
        sessionId,
        productId: product.id,
        quantity: 1,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || null,
      }
    });
  };

  if (isLoading) return <div className="pt-32 min-h-screen text-center">Chargement...</div>;
  if (error || !product) return <div className="pt-32 min-h-screen text-center">Produit introuvable</div>;

  const condition = CONDITIONS[product.condition];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux produits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted relative">
            <img 
              src={product.images[activeImage] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-accent text-white border-none shadow-lg">Nouveau</Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">{product.title}</h1>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-display font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="px-3 py-1 bg-background">{product.category}</Badge>
              {product.brand && <Badge variant="outline" className="px-3 py-1 bg-background">{product.brand}</Badge>}
              <Badge className={`px-3 py-1 border ${condition.color}`}>{condition.label}</Badge>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base text-muted-foreground mb-8">
            <p>{product.description}</p>
          </div>

          {/* Selections */}
          <div className="space-y-6 mb-8">
            {product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">Taille</h3>
                  <button className="text-sm text-primary underline">Guide des tailles</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[3rem] px-4 rounded-xl border-2 font-medium transition-all ${
                        selectedSize === size 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="mt-auto pt-6 border-t">
            <Button 
              size="lg" 
              className={`w-full h-14 rounded-full text-lg font-medium transition-all duration-300 ${isAdded ? 'bg-emerald-500 hover:bg-emerald-600' : 'shadow-xl shadow-primary/20 hover:scale-[1.02]'}`}
              onClick={handleAddToCart}
              disabled={isPending}
            >
              {isPending ? (
                "Ajout..."
              ) : isAdded ? (
                <><Check className="mr-2 h-5 w-5" /> Ajouté au panier</>
              ) : (
                <><ShoppingBag className="mr-2 h-5 w-5" /> Ajouter au panier</>
              )}
            </Button>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Paiement sécurisé
              </div>
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Livraison {product.wilaya}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Section */}
      {product.seller && (
        <div className="mt-20 pt-16 border-t">
          <h2 className="text-2xl font-display font-bold mb-8">À propos du vendeur</h2>
          <div className="bg-muted/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-3xl shrink-0 overflow-hidden">
              {product.seller.avatar ? (
                <img src={product.seller.avatar} alt={product.seller.name} className="w-full h-full object-cover" />
              ) : (
                product.seller.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{product.seller.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" /> {product.seller.city}, {product.seller.wilaya}
                  </div>
                </div>
                <Link href={`/sellers/${product.seller.id}`}>
                  <Button variant="outline" className="rounded-full">Voir le profil</Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-border/50">
                <div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {product.seller.rating} <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-sm text-muted-foreground">{product.seller.reviewCount} avis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{product.seller.productCount}</div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{product.seller.responseRate}%</div>
                  <div className="text-sm text-muted-foreground">Rép. rapide</div>
                </div>
              </div>
              {product.seller.bio && <p className="mt-4 text-muted-foreground">{product.seller.bio}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
