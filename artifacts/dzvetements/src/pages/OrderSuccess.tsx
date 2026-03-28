import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Commande Confirmée !</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Merci pour votre achat. Le vendeur a été notifié et préparera votre commande. 
          Vous paierez à la livraison.
        </p>
        
        <div className="space-y-4">
          <Link href="/products">
            <Button size="lg" className="w-full rounded-full h-14 text-lg">
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full rounded-full h-14 border-2">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
