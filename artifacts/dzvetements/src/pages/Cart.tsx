import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCartSession } from "@/hooks/use-cart-session";
import { useGetCart, useRemoveFromCart, useListWilayas, useCreateOrder } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Cart() {
  const [, setLocation] = useLocation();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [wilayaCode, setWilayaCode] = useState<string>("");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  const { data: cart, isLoading } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const { data: wilayas } = useListWilayas();

  const { mutate: removeItem } = useRemoveFromCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) })
    }
  });

  const { mutate: createOrder, isPending: isOrdering } = useCreateOrder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        setLocation("/order-success");
      }
    }
  });

  const selectedWilaya = wilayas?.find(w => w.code === wilayaCode);
  const deliveryFee = selectedWilaya?.deliveryFee || 0;
  const finalTotal = (cart?.total || 0) + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWilaya) return alert("Veuillez sélectionner une wilaya");
    
    createOrder({
      data: {
        sessionId,
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryWilaya: selectedWilaya.name,
        deliveryAddress: formData.address
      }
    });
  };

  if (isLoading) return <div className="pt-32 min-h-screen text-center">Chargement...</div>;

  if (!cart?.items.length && step === "cart") {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">Découvrez nos tendances et trouvez votre bonheur.</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">Continuer mes achats</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl font-display font-bold mb-10">
        {step === "cart" ? "Mon Panier" : "Finaliser la commande"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {step === "cart" ? (
            <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
              <ul className="divide-y divide-border">
                {cart?.items.map((item) => (
                  <li key={item.id} className="p-6 flex gap-6">
                    <div className="w-24 h-32 bg-muted rounded-xl overflow-hidden shrink-0">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/products/${item.product.id}`} className="font-semibold text-lg hover:text-primary transition-colors">
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">Vendu par {item.product.sellerName}</p>
                        </div>
                        <span className="font-bold text-lg">{formatPrice(item.product.price)}</span>
                      </div>
                      <div className="mt-auto flex justify-between items-end">
                        <div className="text-sm text-muted-foreground">
                          {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem({ itemId: item.id, params: { sessionId } })}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Informations de livraison</h2>
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom complet</label>
                    <Input required placeholder="Ex: Amine Benali" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numéro de téléphone</label>
                    <Input required type="tel" placeholder="0550..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wilaya</label>
                  <Select value={wilayaCode} onValueChange={setWilayaCode} required>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Sélectionner une wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {wilayas?.map(w => (
                        <SelectItem key={w.code} value={w.code}>{w.code} - {w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse détaillée</label>
                  <Input required placeholder="Quartier, rue, bâtiment..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12" />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-muted/50 rounded-3xl p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold mb-6">Résumé</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total ({cart?.itemCount} articles)</span>
                <span className="font-medium">{formatPrice(cart?.total || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span className="font-medium">{deliveryFee ? formatPrice(deliveryFee) : "Calculé à l'étape suivante"}</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display font-bold text-2xl text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {step === "cart" ? (
              <Button 
                size="lg" 
                className="w-full rounded-full h-14 text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                onClick={() => setStep("checkout")}
              >
                Passer la commande <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button 
                type="submit"
                form="checkout-form"
                size="lg" 
                disabled={isOrdering || !wilayaCode}
                className="w-full rounded-full h-14 text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {isOrdering ? "Confirmation..." : "Confirmer l'achat"}
              </Button>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Paiement à la livraison
            </div>
            
            {step === "checkout" && (
              <Button variant="ghost" className="w-full mt-4" onClick={() => setStep("cart")}>
                Retour au panier
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

