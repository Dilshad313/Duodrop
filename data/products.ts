// data/products.ts

export interface SubProduct {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  subProducts: SubProduct[];
}

export const comboProducts: Product[] = [
  // ===== COMBO 1: URBAN STREET COLLECTION =====
  {
    id: "urban-street-combo",
    title: "Urban Street Style Combo",
    description: "Complete your streetwear look with this curated collection of premium sneakers, accessories, and apparel. Perfect for everyday comfort and timeless style.",
    price: 1599,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
    subProducts: [
      { id: "urban-1", name: "Urban Street Sneakers", category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200" },
      { id: "urban-2", name: "Classic Running Shoes", category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200" },
      { id: "urban-3", name: "Premium Cotton T-Shirt", category: "Apparel", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200" },
      { id: "urban-4", name: "Comfort Hoodie", category: "Apparel", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200" },
      { id: "urban-5", name: "Leather Wallet", category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200" },
      { id: "urban-6", name: "Polarized Sunglasses", category: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=200" },
      { id: "urban-7", name: "Analog Watch", category: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200" },
      { id: "urban-8", name: "Travel Backpack", category: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200" },
      { id: "urban-9", name: "Wireless Headphones", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200" },
      { id: "urban-10", name: "Smart Fitness Watch", category: "Electronics", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200" },
    ]
  },

  // ===== COMBO 2: HEALTH & WELLNESS =====
  {
    id: "wellness-combo",
    title: "Ultimate Wellness & Self-Care Pack",
    description: "Elevate your daily routine with this premium wellness bundle. Handpicked essentials for health, mindfulness, and personal care.",
    price: 2499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
    subProducts: [
      { id: "wellness-1", name: "Ocean Perfume 100ml", category: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200" },
      { id: "wellness-2", name: "Essential Oil Diffuser", category: "Wellness", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=200" },
      { id: "wellness-3", name: "Yoga Mat Premium", category: "Fitness", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200" },
      { id: "wellness-4", name: "Meditation Cushion", category: "Wellness", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200" },
      { id: "wellness-5", name: "Aromatherapy Kit", category: "Wellness", image: "https://images.unsplash.com/photo-1595406300539-a52f49dc9e15?q=80&w=200" },
      { id: "wellness-6", name: "Herbal Tea Collection", category: "Food & Drink", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=200" },
      { id: "wellness-7", name: "Bamboo Toothbrush Set", category: "Personal Care", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=200" },
      { id: "wellness-8", name: "Natural Soap Bar", category: "Personal Care", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=200" },
      { id: "wellness-9", name: "Face Roller Kit", category: "Skincare", image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=200" },
      { id: "wellness-10", name: "Sleep Mask & Pillow Spray", category: "Wellness", image: "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=200" },
    ]
  },

  // ===== COMBO 3: FITNESS & ENERGY =====
  {
    id: "fitness-combo",
    title: "Elite Fitness & Energy Pack",
    description: "Fuel your body and smash your fitness goals with this performance bundle. High-quality supplements and premium gear at massive discounts.",
    price: 3199,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200",
    subProducts: Array.from({ length: 10 }, (_, i) => ({
      id: `fit-${i + 1}`,
      name: i === 0 ? "Whey Protein Isolate" : 
            i === 1 ? "Pre-Workout Blast" :
            i === 2 ? "BCAA Recovery Drink" :
            i === 3 ? "Fitness Tracker Pro" :
            i === 4 ? "Gym Bag Premium" :
            i === 5 ? "Resistance Bands Set" :
            i === 6 ? "Smart Water Bottle" :
            i === 7 ? "Foam Roller" :
            i === 8 ? "Jump Rope Pro" :
            "Fitness Towel Set",
      category: i < 3 ? "Supplements" : "Fitness & Training",
      image: `https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200`
    }))
  },

  // ===== COMBO 4: TECH & GADGETS =====
  {
    id: "tech-combo",
    title: "Premium Tech & Gadget Bundle",
    description: "Level up your digital life with this carefully selected tech bundle. From photography to audio, everything you need in one pack.",
    price: 54999,
    originalPrice: 59999,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200",
    subProducts: [
      { id: "tech-1", name: "Canon EOS M50 Mark II", category: "Photography", image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=200" },
      { id: "tech-2", name: "Wireless Noise-Cancelling Headphones", category: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200" },
      { id: "tech-3", name: "Smart Watch Pro", category: "Wearables", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200" },
      { id: "tech-4", name: "Portable Power Bank 20000mAh", category: "Accessories", image: "https://images.unsplash.com/photo-1609592424405-4f95042c93c2?q=80&w=200" },
      { id: "tech-5", name: "Bluetooth Speaker", category: "Audio", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200" },
      { id: "tech-6", name: "Laptop Stand Ergonomic", category: "Accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=200" },
      { id: "tech-7", name: "USB-C Hub 7-in-1", category: "Accessories", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=200" },
      { id: "tech-8", name: "Wireless Charging Pad", category: "Accessories", image: "https://images.unsplash.com/photo-1586810724476-b294b5650f7d?q=80&w=200" },
      { id: "tech-9", name: "Phone Tripod & Mount", category: "Photography", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200" },
      { id: "tech-10", name: "Gaming Mouse Pad XL", category: "Gaming", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=200" },
    ]
  },

  // ===== COMBO 5: HOME & LIVING =====
  {
    id: "home-combo",
    title: "Modern Home & Living Collection",
    description: "Transform your living space with this curated collection of home essentials. Stylish, functional, and designed for modern living.",
    price: 4299,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200",
    subProducts: [
      { id: "home-1", name: "Decorative Cushion Set", category: "Home Decor", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200" },
      { id: "home-2", name: "Indoor Plant with Pot", category: "Plants", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=200" },
      { id: "home-3", name: "Espresso Coffee Maker", category: "Kitchen", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=200" },
      { id: "home-4", name: "Hard Shell Luggage", category: "Travel", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200" },
      { id: "home-5", name: "Soft Throw Blanket", category: "Textiles", image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bac?q=80&w=200" },
      { id: "home-6", name: "Aromatherapy Diffuser", category: "Wellness", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=200" },
      { id: "home-7", name: "Storage Basket Set", category: "Storage", image: "https://images.unsplash.com/photo-1578019871798-a7dcf7e4bbab?q=80&w=200" },
      { id: "home-8", name: "Wall Art Frame", category: "Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=200" },
      { id: "home-9", name: "Desk Organizer", category: "Office", image: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=200" },
      { id: "home-10", name: "Scented Candle Set", category: "Fragrance", image: "https://images.unsplash.com/photo-1602874801007-bd36b2f9d1fa?q=80&w=200" },
    ]
  },

  // ===== COMBO 6: KITCHEN ESSENTIALS =====
  {
    id: "kitchen-combo",
    title: "Gourmet Kitchen Essentials Pack",
    description: "Elevate your cooking experience with this premium kitchen bundle. From coffee to cookware, everything a modern kitchen needs.",
    price: 2799,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200",
    subProducts: [
      { id: "kitchen-1", name: "Ceramic Cookware Set", category: "Cookware", image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=200" },
      { id: "kitchen-2", name: "Coffee Grinder", category: "Coffee", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=200" },
      { id: "kitchen-3", name: "Glass Storage Containers", category: "Storage", image: "https://images.unsplash.com/photo-1578019871798-a7dcf7e4bbab?q=80&w=200" },
      { id: "kitchen-4", name: "Chef Knife Set", category: "Cutlery", image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=200" },
      { id: "kitchen-5", name: "Measuring Cups Set", category: "Baking", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=200" },
      { id: "kitchen-6", name: "Cast Iron Skillet", category: "Cookware", image: "https://images.unsplash.com/photo-1565538420873-8b6e0b2f634f?q=80&w=200" },
      { id: "kitchen-7", name: "Spice Rack Set", category: "Storage", image: "https://images.unsplash.com/photo-1532338548759-4d2cd0012db1?q=80&w=200" },
      { id: "kitchen-8", name: "Bamboo Cutting Board", category: "Preparation", image: "https://images.unsplash.com/photo-1585664811087-47a21ef2ff5c?q=80&w=200" },
      { id: "kitchen-9", name: "Silicone Utensil Set", category: "Utensils", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=200" },
      { id: "kitchen-10", name: "Tea Infuser Set", category: "Beverage", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=200" },
    ]
  },
];