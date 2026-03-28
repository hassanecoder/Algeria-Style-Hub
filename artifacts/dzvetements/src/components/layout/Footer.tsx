import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 rounded-t-[3rem] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary font-display font-bold text-xl">
                Dz
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Vêtements
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm text-lg leading-relaxed">
              Le premier marché de mode en Algérie. Achetez et vendez des vêtements neufs et d'occasion en toute simplicité.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Catégories</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li><Link href="/products?category=Femmes" className="hover:text-white transition-colors">Femmes</Link></li>
              <li><Link href="/products?category=Hommes" className="hover:text-white transition-colors">Hommes</Link></li>
              <li><Link href="/products?category=Enfants" className="hover:text-white transition-colors">Enfants</Link></li>
              <li><Link href="/products?category=Traditionnel" className="hover:text-white transition-colors">Traditionnel</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Aide</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li><a href="#" className="hover:text-white transition-colors">Comment vendre?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Frais de livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Protection acheteur</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contactez-nous</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} DzVêtements. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
