import { db, sellersTable, productsTable, reviewsTable } from "@workspace/db";

const sellers = [
  {
    name: "Fatima Boutique",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
    bio: "Spécialiste en vêtements féminins modernes et traditionnels algériens. Plus de 8 ans d'expérience dans la mode.",
    wilaya: "Alger",
    city: "Alger Centre",
    rating: 4.8,
    reviewCount: 234,
    productCount: 87,
    isVerified: true,
    responseRate: 95,
    phone: "+213 555 012 345",
    joinedDate: new Date("2019-03-15"),
  },
  {
    name: "Mode Oranaise",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=oran",
    bio: "La mode d'Oran au meilleur prix. Vêtements pour toute la famille, spécialité en djellabas et burnous.",
    wilaya: "Oran",
    city: "Oran",
    rating: 4.7,
    reviewCount: 189,
    productCount: 124,
    isVerified: true,
    responseRate: 92,
    phone: "+213 555 098 765",
    joinedDate: new Date("2018-06-20"),
  },
  {
    name: "Karim Fashion",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim",
    bio: "Mode masculine haut de gamme. Costumes, chemises et tenues décontractées pour homme algérien moderne.",
    wilaya: "Constantine",
    city: "Constantine",
    rating: 4.6,
    reviewCount: 156,
    productCount: 68,
    isVerified: true,
    responseRate: 88,
    phone: "+213 555 234 567",
    joinedDate: new Date("2020-01-10"),
  },
  {
    name: "Boutique Sétifienne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=setif",
    bio: "Vêtements traditionnels et modernes depuis Sétif. Spécialité en robes de mariée et caftans algériens.",
    wilaya: "Sétif",
    city: "Sétif",
    rating: 4.9,
    reviewCount: 312,
    productCount: 203,
    isVerified: true,
    responseRate: 98,
    phone: "+213 555 345 678",
    joinedDate: new Date("2017-09-05"),
  },
  {
    name: "Amel Sport",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amel",
    bio: "Équipements sportifs et vêtements de sport authentiques. Représentant officiel de plusieurs marques en Algérie.",
    wilaya: "Blida",
    city: "Blida",
    rating: 4.5,
    reviewCount: 98,
    productCount: 45,
    isVerified: false,
    responseRate: 85,
    phone: "+213 555 456 789",
    joinedDate: new Date("2021-04-22"),
  },
  {
    name: "Bijoux & Co Tlemcen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tlemcen",
    bio: "Bijoux artisanaux et accessoires de mode de Tlemcen. Argent, or et pierres semi-précieuses.",
    wilaya: "Tlemcen",
    city: "Tlemcen",
    rating: 4.8,
    reviewCount: 267,
    productCount: 156,
    isVerified: true,
    responseRate: 96,
    phone: "+213 555 567 890",
    joinedDate: new Date("2018-11-30"),
  },
  {
    name: "Kids Paradise Annaba",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=annaba",
    bio: "Vêtements enfants de qualité à prix abordables. Du 0 mois jusqu'à 14 ans.",
    wilaya: "Annaba",
    city: "Annaba",
    rating: 4.4,
    reviewCount: 78,
    productCount: 134,
    isVerified: false,
    responseRate: 80,
    phone: "+213 555 678 901",
    joinedDate: new Date("2021-08-15"),
  },
  {
    name: "Safia Haute Couture",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=safia",
    bio: "Haute couture algérienne. Créations exclusives inspirées du patrimoine et de la modernité.",
    wilaya: "Alger",
    city: "Hydra",
    rating: 4.9,
    reviewCount: 445,
    productCount: 89,
    isVerified: true,
    responseRate: 99,
    phone: "+213 555 789 012",
    joinedDate: new Date("2016-02-14"),
  },
];

const UNSPLASH_FASHION = {
  femmes_robe: [
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80",
  ],
  femmes_hauts: [
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
  ],
  hommes_chemise: [
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
  ],
  hommes_costume: [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
  ],
  traditionnel: [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80",
  ],
  sport: [
    "https://images.unsplash.com/photo-1556906781-9a412961d28c?w=600&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1495555961986-b11d42a3c3e7?w=600&q=80",
  ],
  accessoires_sac: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
  ],
  enfants: [
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
  ],
  chaussures: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
  ],
};

type ProductData = {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  condition: string;
  brand?: string;
  sellerId: number;
  wilaya: string;
  city: string;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount: number;
  viewCount: number;
};

function makeProducts(sellerIds: number[]): ProductData[] {
  return [
  // FEMMES
  {
    title: "Robe Soirée Brodée Dorée",
    description: "Magnifique robe de soirée brodée à la main avec des fils dorés. Parfaite pour les mariages et cérémonies algériennes. Tissu de haute qualité, coupe élégante qui met en valeur la silhouette.",
    price: 8500, originalPrice: 12000, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_robe,
    category: "femmes", subcategory: "robes",
    sizes: ["S", "M", "L", "XL"], colors: ["Or", "Blanc", "Champagne"],
    condition: "new", brand: "Safia Couture",
    sellerId: sellerIds[7], wilaya: "Alger", city: "Hydra",
    isFeatured: true, isNew: true, isActive: true, rating: 4.9, reviewCount: 23, viewCount: 456,
  },
  {
    title: "Robe Casual Été Fleurie",
    description: "Robe légère et fraîche pour l'été, motif floral coloré. Idéale pour les sorties quotidiennes. Tissu en coton respirant, très confortable.",
    price: 2800, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_robe,
    category: "femmes", subcategory: "robes",
    sizes: ["XS", "S", "M", "L"], colors: ["Bleu floral", "Rouge floral", "Vert floral"],
    condition: "new",
    sellerId: sellerIds[0], wilaya: "Alger", city: "Bab El Oued",
    isFeatured: true, isNew: true, isActive: true, rating: 4.5, reviewCount: 18, viewCount: 324,
  },
  {
    title: "Chemisier Élégant Soie",
    description: "Chemisier en soie naturelle, coupe classique et élégante. Parfait pour le bureau ou les occasions formelles. Entretien facile.",
    price: 3200, originalPrice: 4500, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_hauts,
    category: "femmes", subcategory: "hauts",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc", "Noir", "Beige", "Bleu marine"],
    condition: "new", brand: "Mode Douce",
    sellerId: sellerIds[0], wilaya: "Alger", city: "Alger Centre",
    isFeatured: false, isNew: true, isActive: true, rating: 4.3, reviewCount: 12, viewCount: 198,
  },
  {
    title: "Jean Femme Skinny Bleu",
    description: "Jean skinny de haute qualité, coupe tendance et confortable. Idéal pour toutes les occasions. Taille haute, effet gainant.",
    price: 4200, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_hauts,
    category: "femmes", subcategory: "pantalons-femmes",
    sizes: ["36", "38", "40", "42", "44"], colors: ["Bleu délavé", "Noir", "Gris"],
    condition: "new",
    sellerId: sellerIds[3], wilaya: "Sétif", city: "Sétif",
    isFeatured: true, isNew: true, isActive: true, rating: 4.7, reviewCount: 34, viewCount: 567,
  },
  {
    title: "Manteau Laine Hiver Femme",
    description: "Manteau chaud en laine mélangée, style élégant pour l'hiver. Doublure intérieure, fermeture boutonnée. Parfait pour les hivers algériens.",
    price: 9800, originalPrice: 14000, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_robe,
    category: "femmes", subcategory: "manteaux-femmes",
    sizes: ["S", "M", "L", "XL"], colors: ["Camel", "Noir", "Gris anthracite"],
    condition: "new", brand: "WinterChic",
    sellerId: sellerIds[0], wilaya: "Alger", city: "El Harrach",
    isFeatured: true, isNew: false, isActive: true, rating: 4.6, reviewCount: 28, viewCount: 412,
  },
  // HOMMES
  {
    title: "Chemise Oxford Homme Blanche",
    description: "Chemise classique en tissu Oxford 100% coton. Coupe slim fit moderne, parfaite pour le travail et les occasions formelles. Repassage facile.",
    price: 3500, currency: "DZD",
    images: UNSPLASH_FASHION.hommes_chemise,
    category: "hommes", subcategory: "chemises",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc", "Bleu ciel", "Gris rayé"],
    condition: "new", brand: "AlMode Homme",
    sellerId: sellerIds[2], wilaya: "Constantine", city: "Constantine",
    isFeatured: true, isNew: true, isActive: true, rating: 4.7, reviewCount: 45, viewCount: 678,
  },
  {
    title: "Costume 3 Pièces Élégant Gris",
    description: "Costume 3 pièces (veste, pantalon, gilet) en tissu premium. Parfait pour mariages, fiançailles et cérémonies. Couture soignée et finitions impeccables.",
    price: 24000, originalPrice: 32000, currency: "DZD",
    images: UNSPLASH_FASHION.hommes_costume,
    category: "hommes", subcategory: "costumes",
    sizes: ["46", "48", "50", "52", "54", "56"], colors: ["Gris anthracite", "Bleu marine", "Noir"],
    condition: "new", brand: "Prestige DZ",
    sellerId: sellerIds[1], wilaya: "Oran", city: "Oran",
    isFeatured: true, isNew: true, isActive: true, rating: 4.8, reviewCount: 67, viewCount: 892,
  },
  {
    title: "Jean Homme Regular Fit",
    description: "Jean homme classique regular fit, tissu denim robuste. Confort optimal pour un usage quotidien. Disponible en plusieurs coloris.",
    price: 3800, originalPrice: 5000, currency: "DZD",
    images: UNSPLASH_FASHION.hommes_chemise,
    category: "hommes", subcategory: "pantalons-hommes",
    sizes: ["38", "40", "42", "44", "46"], colors: ["Bleu classique", "Noir", "Gris"],
    condition: "new",
    sellerId: sellerIds[2], wilaya: "Constantine", city: "El Khroub",
    isFeatured: false, isNew: true, isActive: true, rating: 4.4, reviewCount: 23, viewCount: 345,
  },
  {
    title: "Veste Cuir Homme Marron",
    description: "Veste en cuir véritable, style motard moderne. Doublure intérieure, plusieurs poches. Un classique intemporel pour l'homme algérien.",
    price: 16500, currency: "DZD",
    images: UNSPLASH_FASHION.hommes_costume,
    category: "hommes", subcategory: "manteaux-hommes",
    sizes: ["M", "L", "XL", "XXL"], colors: ["Marron", "Noir"],
    condition: "like_new", brand: "Cuir Algérien",
    sellerId: sellerIds[2], wilaya: "Constantine", city: "Constantine",
    isFeatured: true, isNew: false, isActive: true, rating: 4.6, reviewCount: 19, viewCount: 423,
  },
  {
    title: "T-shirt Homme Col V Basique",
    description: "Pack de 3 t-shirts homme col V, 100% coton. Confortables au quotidien, faciles d'entretien. Disponibles en plusieurs couleurs.",
    price: 1800, originalPrice: 2500, currency: "DZD",
    images: UNSPLASH_FASHION.hommes_chemise,
    category: "hommes", subcategory: "chemises",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc", "Noir", "Gris", "Marine"],
    condition: "new",
    sellerId: sellerIds[1], wilaya: "Oran", city: "Bir El Djir",
    isFeatured: false, isNew: true, isActive: true, rating: 4.2, reviewCount: 56, viewCount: 234,
  },
  // TRADITIONNEL
  {
    title: "Caftan Algérien Mariage Bordeaux",
    description: "Caftan traditionnel algérien pour mariages et cérémonies. Broderies à la main en fil doré, tissu velours de qualité supérieure. Coupe princesse majestueuse.",
    price: 45000, originalPrice: 65000, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "caftan",
    sizes: ["S", "M", "L", "XL", "Sur mesure"], colors: ["Bordeaux doré", "Vert émeraude", "Bleu royal", "Noir doré"],
    condition: "new", brand: "Safia Couture",
    sellerId: sellerIds[7], wilaya: "Alger", city: "Hydra",
    isFeatured: true, isNew: true, isActive: true, rating: 5.0, reviewCount: 89, viewCount: 2341,
  },
  {
    title: "Gandoura Homme Blanche Été",
    description: "Gandoura homme traditionnelle en coton blanc pur, idéale pour le Ramadan et les prières. Broderies élégantes au col et aux poignets.",
    price: 3200, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "burnous",
    sizes: ["M", "L", "XL", "XXL"], colors: ["Blanc", "Beige", "Bleu ciel"],
    condition: "new",
    sellerId: sellerIds[3], wilaya: "Sétif", city: "Sétif",
    isFeatured: true, isNew: true, isActive: true, rating: 4.8, reviewCount: 134, viewCount: 1567,
  },
  {
    title: "Haïk Moderne Kabyle",
    description: "Haïk traditionnel kabyle revisité avec une touche moderne. Motifs géométriques berbères authentiques tissés à la main. Pièce unique du patrimoine algérien.",
    price: 12000, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "haik",
    sizes: ["Taille unique"], colors: ["Blanc et rouge", "Blanc et noir", "Multicolore"],
    condition: "new", brand: "Artisanat Kabyle",
    sellerId: sellerIds[3], wilaya: "Sétif", city: "Béjaïa",
    isFeatured: true, isNew: true, isActive: true, rating: 4.9, reviewCount: 56, viewCount: 987,
  },
  {
    title: "Burnous Laine Hiver Traditionnel",
    description: "Burnous traditionnel algérien en laine pure, ouvrage artisanal de qualité. Protection parfaite contre le froid. Pièce de patrimoine intemporelle.",
    price: 28000, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "burnous",
    sizes: ["M", "L", "XL"], colors: ["Blanc", "Beige", "Marron naturel"],
    condition: "new", brand: "Artisanat DZ",
    sellerId: sellerIds[1], wilaya: "Oran", city: "Tlemcen",
    isFeatured: false, isNew: false, isActive: true, rating: 4.7, reviewCount: 23, viewCount: 456,
  },
  {
    title: "Tenue Oranaise Cérémonie Dorée",
    description: "Tenue traditionnelle oranaise complète pour cérémonies. Tissu broudré, ceinture assortie incluse. Disponible en sur-mesure.",
    price: 38000, originalPrice: 50000, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "oranaise",
    sizes: ["S", "M", "L", "XL", "Sur mesure"], colors: ["Doré", "Rose gold", "Argent"],
    condition: "new", brand: "Mode Oranaise",
    sellerId: sellerIds[1], wilaya: "Oran", city: "Oran",
    isFeatured: true, isNew: true, isActive: true, rating: 4.9, reviewCount: 78, viewCount: 1234,
  },
  // SPORTSWEAR
  {
    title: "Ensemble Fitness Femme Noir",
    description: "Ensemble sport 2 pièces (legging + brassière) en tissu technique respirant. Soutien optimal, coutures plates. Idéal pour le gym et le yoga.",
    price: 4200, originalPrice: 6000, currency: "DZD",
    images: UNSPLASH_FASHION.sport,
    category: "sportswear", subcategory: "fitness",
    sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Marine", "Gris", "Rose"],
    condition: "new", brand: "SportDZ",
    sellerId: sellerIds[4], wilaya: "Blida", city: "Blida",
    isFeatured: true, isNew: true, isActive: true, rating: 4.6, reviewCount: 47, viewCount: 678,
  },
  {
    title: "Jogging Homme Molleton Bleu",
    description: "Survêtement complet (veste + pantalon) en molleton premium. Confort maximum pour le sport ou la détente. Poches zippées, col montant.",
    price: 5800, currency: "DZD",
    images: UNSPLASH_FASHION.sport,
    category: "sportswear", subcategory: "running",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu marine", "Noir", "Gris"],
    condition: "new", brand: "ActiveWear DZ",
    sellerId: sellerIds[4], wilaya: "Blida", city: "Boufarik",
    isFeatured: false, isNew: true, isActive: true, rating: 4.4, reviewCount: 32, viewCount: 456,
  },
  {
    title: "Maillot FAF Algérie Domicile 2024",
    description: "Maillot officiel de l'équipe nationale d'Algérie, version domicile 2024. Tissu technique Climalite, flocage disponible. يا ديما يا كان!",
    price: 4500, originalPrice: 6000, currency: "DZD",
    images: UNSPLASH_FASHION.sport,
    category: "sportswear", subcategory: "football",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc et vert"],
    condition: "new", brand: "FAF Official",
    sellerId: sellerIds[4], wilaya: "Blida", city: "Blida",
    isFeatured: true, isNew: true, isActive: true, rating: 4.9, reviewCount: 234, viewCount: 3456,
  },
  // ACCESSOIRES
  {
    title: "Sac à Main Cuir Femme Camel",
    description: "Sac à main en cuir véritable, style classique et élégant. Grand compartiment principal, poches intérieures organisées. Bandoulière amovible.",
    price: 7500, originalPrice: 11000, currency: "DZD",
    images: UNSPLASH_FASHION.accessoires_sac,
    category: "accessoires", subcategory: "sacs",
    sizes: ["Taille unique"], colors: ["Camel", "Noir", "Bordeaux", "Marron"],
    condition: "new", brand: "Maroquinerie DZ",
    sellerId: sellerIds[5], wilaya: "Tlemcen", city: "Tlemcen",
    isFeatured: true, isNew: true, isActive: true, rating: 4.7, reviewCount: 89, viewCount: 1234,
  },
  {
    title: "Foulard Soie Imprimé Multicolore",
    description: "Foulard en soie naturelle aux motifs traditionnels algériens réinterprétés. Peut s'utiliser comme hijab, écharpe ou accessoire de sac.",
    price: 2200, currency: "DZD",
    images: UNSPLASH_FASHION.accessoires_sac,
    category: "accessoires", subcategory: "foulards",
    sizes: ["90x90cm", "140x140cm"], colors: ["Multicolore", "Bleu doré", "Rouge bordeaux"],
    condition: "new",
    sellerId: sellerIds[5], wilaya: "Tlemcen", city: "Tlemcen",
    isFeatured: false, isNew: true, isActive: true, rating: 4.5, reviewCount: 34, viewCount: 567,
  },
  {
    title: "Collier Argent Berbère Artisanal",
    description: "Collier artisanal en argent massif, motifs berbères authentiques. Pièce unique réalisée par des artisans de Ghardaïa. Certificat d'authenticité inclus.",
    price: 8500, currency: "DZD",
    images: UNSPLASH_FASHION.accessoires_sac,
    category: "accessoires", subcategory: "bijoux",
    sizes: ["Taille unique"], colors: ["Argent", "Argent doré"],
    condition: "new", brand: "Artisanat Ghardaïa",
    sellerId: sellerIds[5], wilaya: "Tlemcen", city: "Tlemcen",
    isFeatured: true, isNew: true, isActive: true, rating: 4.8, reviewCount: 56, viewCount: 789,
  },
  {
    title: "Sneakers Homme Blanc Classique",
    description: "Sneakers en cuir blanc classique, semelle gomme. Confortables pour un port prolongé. Style minimaliste et élégant qui se porte avec tout.",
    price: 9200, originalPrice: 12000, currency: "DZD",
    images: UNSPLASH_FASHION.chaussures,
    category: "accessoires", subcategory: "chaussures",
    sizes: ["40", "41", "42", "43", "44", "45"], colors: ["Blanc", "Blanc et beige"],
    condition: "new", brand: "StepDZ",
    sellerId: sellerIds[1], wilaya: "Oran", city: "Oran",
    isFeatured: true, isNew: true, isActive: true, rating: 4.6, reviewCount: 78, viewCount: 1023,
  },
  {
    title: "Sandales Femme Dorées Été",
    description: "Sandales plates dorées, style bohème chic. Parfaites pour l'été algérien. Cuir synthétique de qualité, semelle confortable.",
    price: 3800, currency: "DZD",
    images: UNSPLASH_FASHION.chaussures,
    category: "accessoires", subcategory: "chaussures",
    sizes: ["36", "37", "38", "39", "40", "41"], colors: ["Doré", "Argent", "Nude"],
    condition: "new",
    sellerId: sellerIds[3], wilaya: "Sétif", city: "Sétif",
    isFeatured: false, isNew: true, isActive: true, rating: 4.3, reviewCount: 28, viewCount: 345,
  },
  // ENFANTS
  {
    title: "Ensemble Bébé Coton Bio 3-6 mois",
    description: "Ensemble complet bébé (body + pantalon + bonnet) en coton biologique certifié. Doux sur la peau délicate des bébés. Sans produits chimiques.",
    price: 2500, currency: "DZD",
    images: UNSPLASH_FASHION.enfants,
    category: "enfants", subcategory: "bebes",
    sizes: ["3m", "6m", "9m", "12m"], colors: ["Blanc", "Rose pâle", "Bleu ciel", "Jaune"],
    condition: "new", brand: "BabyDZ",
    sellerId: sellerIds[6], wilaya: "Annaba", city: "Annaba",
    isFeatured: false, isNew: true, isActive: true, rating: 4.7, reviewCount: 45, viewCount: 567,
  },
  {
    title: "Robe Petite Fille Occasion Blanche",
    description: "Robe de cérémonie pour petite fille (2-8 ans), tissu satiné blanc avec nœud en satin. Parfaite pour les mariages et baptêmes. Fermeture éclair dos.",
    price: 3800, originalPrice: 5500, currency: "DZD",
    images: UNSPLASH_FASHION.enfants,
    category: "enfants", subcategory: "filles",
    sizes: ["2ans", "3ans", "4ans", "5ans", "6ans", "7ans", "8ans"], colors: ["Blanc", "Rose", "Ivoire"],
    condition: "new",
    sellerId: sellerIds[6], wilaya: "Annaba", city: "El Bouni",
    isFeatured: true, isNew: true, isActive: true, rating: 4.6, reviewCount: 23, viewCount: 345,
  },
  {
    title: "Pantalon Jogging Garçon Pack 2",
    description: "Pack de 2 pantalons de jogging pour garçon (4-14 ans). Taille élastique confortable, chevilles resserrées. Tissu molleton léger pour toutes saisons.",
    price: 2800, currency: "DZD",
    images: UNSPLASH_FASHION.enfants,
    category: "enfants", subcategory: "garcons",
    sizes: ["4ans", "6ans", "8ans", "10ans", "12ans", "14ans"], colors: ["Gris/Marine", "Noir/Gris", "Bleu/Vert"],
    condition: "new",
    sellerId: sellerIds[6], wilaya: "Annaba", city: "Annaba",
    isFeatured: false, isNew: true, isActive: true, rating: 4.4, reviewCount: 34, viewCount: 456,
  },
  {
    title: "Doudoune Adolescent Hiver Légère",
    description: "Doudoune légère et chaude pour adolescents (12-16 ans). Rembourrage synthétique ultra-léger, coupe moderne. Capuche amovible. Parfait pour l'hiver algérien.",
    price: 6500, originalPrice: 9000, currency: "DZD",
    images: UNSPLASH_FASHION.enfants,
    category: "enfants", subcategory: "ados",
    sizes: ["12ans", "14ans", "16ans"], colors: ["Noir", "Bleu marine", "Kaki", "Rouge"],
    condition: "new", brand: "TeenStyle",
    sellerId: sellerIds[6], wilaya: "Annaba", city: "Skikda",
    isFeatured: true, isNew: true, isActive: true, rating: 4.5, reviewCount: 18, viewCount: 287,
  },
  // ADDITIONAL PRODUCTS
  {
    title: "Robe Longue Maxi Bohème",
    description: "Robe maxi bohème en mousseline légère. Imprimé ethnique inspiré des motifs du Sahara algérien. Idéale pour l'été et les sorties de plage.",
    price: 5500, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_robe,
    category: "femmes", subcategory: "robes",
    sizes: ["XS", "S", "M", "L", "XL"], colors: ["Ocre", "Terracotta", "Blanc sable"],
    condition: "new",
    sellerId: sellerIds[7], wilaya: "Alger", city: "Alger Centre",
    isFeatured: false, isNew: true, isActive: true, rating: 4.4, reviewCount: 29, viewCount: 387,
  },
  {
    title: "Tailleur Femme Bureau Classique",
    description: "Tailleur pantalon femme classe, idéal pour le milieu professionnel. Tissu habilité, coupe impeccable. Veste cintrée + pantalon taille haute.",
    price: 12000, originalPrice: 16000, currency: "DZD",
    images: UNSPLASH_FASHION.femmes_hauts,
    category: "femmes", subcategory: "manteaux-femmes",
    sizes: ["36", "38", "40", "42", "44", "46"], colors: ["Noir", "Bleu marine", "Gris", "Bordeaux"],
    condition: "new", brand: "ProFemme DZ",
    sellerId: sellerIds[0], wilaya: "Alger", city: "Alger Centre",
    isFeatured: true, isNew: true, isActive: true, rating: 4.8, reviewCount: 67, viewCount: 892,
  },
  {
    title: "Djellaba Homme Bleue Ramadan",
    description: "Djellaba longue pour homme, tissu de qualité premium. Idéale pour le Ramadan et les prières du vendredi. Broderies fines au col et poignets.",
    price: 5500, currency: "DZD",
    images: UNSPLASH_FASHION.traditionnel,
    category: "traditionnel", subcategory: "burnous",
    sizes: ["L", "XL", "XXL", "XXXL"], colors: ["Bleu roi", "Blanc cassé", "Vert foncé", "Beige"],
    condition: "new",
    sellerId: sellerIds[3], wilaya: "Sétif", city: "Sétif",
    isFeatured: false, isNew: true, isActive: true, rating: 4.7, reviewCount: 89, viewCount: 1123,
  },
  {
    title: "Sac à Dos Cuir Homme Vintage",
    description: "Sac à dos en cuir vieilli style vintage. Compartiments multiples, fermoir à boucle. Idéal pour le travail et les voyages. Capacité 25L.",
    price: 11000, originalPrice: 15000, currency: "DZD",
    images: UNSPLASH_FASHION.accessoires_sac,
    category: "accessoires", subcategory: "sacs",
    sizes: ["Taille unique"], colors: ["Marron vintage", "Cognac", "Noir"],
    condition: "new", brand: "UrbanDZ",
    sellerId: sellerIds[2], wilaya: "Constantine", city: "Constantine",
    isFeatured: false, isNew: true, isActive: true, rating: 4.5, reviewCount: 34, viewCount: 567,
  },
];
}

const reviews = [
  { reviewerName: "Yasmine B.", rating: 5, comment: "Qualité exceptionnelle ! La robe est encore plus belle en vrai. Livraison rapide à Alger, emballage soigné. Je recommande vivement !" },
  { reviewerName: "Mohamed K.", rating: 4, comment: "Très bonne qualité pour le prix. La taille correspond bien au guide. Vendeur sérieux et réactif." },
  { reviewerName: "Nour A.", rating: 5, comment: "Magnifique ! Exactement comme sur les photos. J'ai reçu beaucoup de compliments lors du mariage. Merci !" },
  { reviewerName: "Rachid M.", rating: 4, comment: "Tissu de bonne qualité, coupe élégante. Légèrement grand en taille, prendre une taille en dessous." },
  { reviewerName: "Amina S.", rating: 5, comment: "Parfait pour mon mariage ! La vendeuse était très professionnelle et disponible pour les conseils." },
  { reviewerName: "Hamid L.", rating: 3, comment: "Bon produit mais la livraison a pris un peu plus de temps que prévu. La qualité est au rendez-vous néanmoins." },
  { reviewerName: "Soraya T.", rating: 5, comment: "Inoubliable ce caftan ! Toutes mes invitées m'ont demandé où je l'avais acheté. Service 5 étoiles !" },
  { reviewerName: "Billal C.", rating: 4, comment: "Excellent rapport qualité-prix. Le tissu est durable et la coupe est moderne. Je reviendrai !" },
];

async function seed() {
  const seedMode = process.env.SEED_MODE === "bootstrap" ? "bootstrap" : "reset";
  console.log(`🌱 Seeding database in ${seedMode} mode...`);

  if (seedMode === "bootstrap") {
    const existing = await db.select().from(productsTable).limit(1);
    if (existing.length > 0) {
      console.log("Bootstrap seed skipped; products already present");
      return;
    }
  }

  console.log("Inserting sellers...");
  const insertedSellers = await db.insert(sellersTable).values(sellers).returning();
  const sellerIds = insertedSellers.map((s) => s.id);
  console.log(`✅ Inserted ${sellerIds.length} sellers`);

  console.log("Inserting products...");
  const products = makeProducts(sellerIds);
  const insertedProducts = await db.insert(productsTable).values(products).returning();
  console.log(`✅ Inserted ${insertedProducts.length} products`);

  console.log("Inserting reviews...");
  const reviewInserts = insertedProducts.slice(0, 8).flatMap((product, i) => {
    return reviews.slice(0, 3 + (i % 4)).map((review) => ({
      ...review,
      productId: product.id,
    }));
  });
  await db.insert(reviewsTable).values(reviewInserts);
  console.log(`✅ Inserted ${reviewInserts.length} reviews`);

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
