import { Link } from "wouter";
import { formatPrice, CONDITIONS } from "@/lib/utils";
import type { Product } from "@workspace/api-client-react";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const condition = CONDITIONS[product.condition];

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group flex flex-col gap-3 cursor-pointer">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className={`backdrop-blur-md border ${condition.color}`}>
              {condition.label}
            </Badge>
            {product.isFeatured && (
              <Badge className="bg-accent text-white border-none shadow-lg">
                À la une
              </Badge>
            )}
          </div>
          
          {/* Seller badge bottom right */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium max-w-full overflow-hidden">
              <span className="truncate">{product.sellerName}</span>
              {product.rating && (
                <div className="flex items-center text-amber-500 shrink-0">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="ml-1 text-foreground">{product.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{product.city}, {product.wilaya}</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display font-bold text-lg text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex gap-1 flex-wrap pt-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {product.sizes[0]}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {product.brand || product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
