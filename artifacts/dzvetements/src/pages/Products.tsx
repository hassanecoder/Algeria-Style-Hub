import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useListProducts, useListCategories, useListWilayas } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONDITIONS } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  // State for filters
  const [category, setCategory] = useState(params.get("category") || "");
  const [wilaya, setWilaya] = useState(params.get("wilaya") || "");
  const [condition, setCondition] = useState<any>(params.get("condition") || "");
  const [sort, setSort] = useState<any>(params.get("sort") || "newest");
  const searchQuery = params.get("search") || "";

  // Data fetching
  const { data: productsData, isLoading } = useListProducts({
    category: category || undefined,
    wilaya: wilaya || undefined,
    condition: condition || undefined,
    sort: sort || undefined,
    search: searchQuery || undefined,
    limit: 24
  });

  const { data: categories } = useListCategories();
  const { data: wilayas } = useListWilayas();

  const resetFilters = () => {
    setCategory("");
    setWilaya("");
    setCondition("");
    setSort("newest");
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold mb-4 text-foreground">Catégorie</h4>
        <div className="space-y-2">
          <div 
            className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
            onClick={() => setCategory("")}
          >
            Toutes les catégories
          </div>
          {categories?.map(cat => (
            <div 
              key={cat.id}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.name ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name} ({cat.productCount})
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-foreground">Wilaya</h4>
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toute l'Algérie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute l'Algérie</SelectItem>
            {wilayas?.map(w => (
              <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-foreground">État</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CONDITIONS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setCondition(condition === key ? "" : key)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                condition === key 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'bg-background hover:border-primary/50 text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {(category || wilaya || condition) && (
        <Button variant="ghost" className="w-full text-destructive" onClick={resetFilters}>
          Effacer les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-4">
          {searchQuery ? `Résultats pour "${searchQuery}"` : category ? category : "Tous les produits"}
        </h1>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-muted-foreground">
            {productsData?.total || 0} articles trouvés
          </p>
          
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden rounded-full border-2">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <FiltersContent />
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] rounded-full border-2">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
                <SelectItem value="popular">Populaires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-10 flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 border rounded-3xl p-6 bg-card">
            <div className="flex items-center gap-2 mb-6 font-display font-bold text-lg">
              <SlidersHorizontal className="w-5 h-5" /> Filtres
            </div>
            <FiltersContent />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-3">
                  <div className="bg-muted aspect-[4/5] rounded-2xl" />
                  <div className="h-4 bg-muted w-3/4 rounded" />
                  <div className="h-4 bg-muted w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : productsData?.products.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres de recherche.</p>
              <Button onClick={resetFilters} variant="outline" className="rounded-full">Effacer les filtres</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {productsData?.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
