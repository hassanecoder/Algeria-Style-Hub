import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProduct, useListCategories, useListWilayas } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2 } from "lucide-react";

// Just mocking a seller ID for demo purposes since auth isn't fully implemented in requirements
const MOCK_SELLER_ID = 1;

const sellSchema = z.object({
  title: z.string().min(5, "Titre trop court"),
  description: z.string().min(20, "Description détaillée requise"),
  price: z.coerce.number().min(100, "Prix minimum 100 DA"),
  category: z.string().min(1, "Catégorie requise"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  size: z.string().optional(),
  brand: z.string().optional(),
  wilaya: z.string().min(1, "Wilaya requise"),
  city: z.string().min(1, "Ville requise"),
});

export default function Sell() {
  const [, setLocation] = useLocation();
  const [images, setImages] = useState<string[]>([]);
  const { data: categories } = useListCategories();
  const { data: wilayas } = useListWilayas();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema),
  });

  const { mutate: createProduct, isPending } = useCreateProduct({
    mutation: {
      onSuccess: (data) => {
        setLocation(`/products/${data.id}`);
      }
    }
  });

  // Mock image upload
  const handleAddImage = () => {
    // In a real app, this would be a file input uploading to S3/Cloudinary
    const mockImages = [
      "https://images.unsplash.com/photo-1578587018452-892bace03529?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550614000-4b95d4ebfa88?auto=format&fit=crop&q=80&w=800"
    ];
    if (images.length < 4) {
      setImages([...images, mockImages[images.length % 2]]);
    }
  };

  const onSubmit = (data: z.infer<typeof sellSchema>) => {
    if (images.length === 0) return alert("Ajoutez au moins une photo");
    
    createProduct({
      data: {
        ...data,
        images,
        sizes: data.size ? [data.size] : [],
        colors: [],
        sellerId: MOCK_SELLER_ID,
      }
    });
  };

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">Vendre un article</h1>
        <p className="text-muted-foreground">Ajoutez les détails de votre vêtement pour le mettre en ligne.</p>
      </div>

      <div className="bg-card border rounded-[2rem] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Photos */}
          <div className="space-y-3">
            <label className="text-base font-semibold">Photos (Max 4)</label>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border relative">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full text-xs">×</button>
                </div>
              ))}
              {images.length < 4 && (
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary hover:bg-primary/5 transition-colors shrink-0"
                >
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Ajouter</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Détails</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input {...register("title")} placeholder="Ex: Veste en cuir vintage" className="h-12 rounded-xl" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea {...register("description")} placeholder="Décrivez l'état, la matière, pourquoi vous le vendez..." className="h-32 rounded-xl resize-none" />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select onValueChange={(val) => setValue("category", val)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => <SelectItem key={w => w.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">État</label>
                <Select onValueChange={(val: any) => setValue("condition", val)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveau (avec étiquette)</SelectItem>
                    <SelectItem value="like_new">Comme neuf</SelectItem>
                    <SelectItem value="good">Bon état</SelectItem>
                    <SelectItem value="fair">Acceptable</SelectItem>
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-sm text-destructive">{errors.condition.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Marque (Optionnel)</label>
                <Input {...register("brand")} placeholder="Ex: Zara" className="h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Taille (Optionnel)</label>
                <Input {...register("size")} placeholder="Ex: M, 38, Unique" className="h-12 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Prix & Localisation</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix (Dinar Algérien)</label>
              <div className="relative">
                <Input type="number" {...register("price")} placeholder="0" className="h-12 rounded-xl pl-4 pr-12 text-lg font-bold" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 font-medium text-muted-foreground pointer-events-none">DA</div>
              </div>
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wilaya</label>
                <Select onValueChange={(val) => setValue("wilaya", val)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayas?.map(w => <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.wilaya && <p className="text-sm text-destructive">{errors.wilaya.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Commune/Ville</label>
                <Input {...register("city")} placeholder="Ex: Bab Ezzouar" className="h-12 rounded-xl" />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            disabled={isPending}
            className="w-full h-14 rounded-full text-lg shadow-lg hover:scale-[1.02] transition-transform"
          >
            {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publication...</> : "Publier l'annonce"}
          </Button>
        </form>
      </div>
    </div>
  );
}
