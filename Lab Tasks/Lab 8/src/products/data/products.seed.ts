export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  stock: number;
  sizes: string[];
  colors: string[];
  reviews: {
    id: number;
    reviewerName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Embroidered Suit",
    description: "Exquisite maroon embroidered 3-piece suit with intricate neckline embroidery and pure chiffon dupatta.",
    category: "Eastern Pret",
    price: 2990,
    originalPrice: 5990,
    discount: "50%",
    stock: 25,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Maroon", "Burgundy"],
    reviews: [
      {
        id: 1,
        reviewerName: "Ayesha K.",
        rating: 5,
        comment: "Fabric quality and embroidery are stunning! Perfect fit for festive events.",
        createdAt: "2026-10-26T12:00:00.000Z"
      }
    ],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Embroidered Kurta",
    description: "Teal raw silk kurta featuring tonal thread work and subtle bead detailing along cuffs and hem.",
    category: "Eastern Pret",
    price: 4190,
    originalPrice: 6990,
    discount: "40%",
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Teal", "Emerald"],
    reviews: [
      {
        id: 1,
        reviewerName: "Fatima Noor",
        rating: 4.8,
        comment: "Rich teal tone and very comfortable stitching.",
        createdAt: "2026-10-27T14:30:00.000Z"
      }
    ],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 3,
    name: "Chiffon Formal Suit",
    description: "Midnight navy luxury formal suit tailored from premium airy chiffon with delicate zardozi detailing.",
    category: "Eastern Pret",
    price: 8490,
    originalPrice: null,
    discount: null,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Royal Blue"],
    reviews: [],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 4,
    name: "Cotton Kurta",
    description: "Soft breathable candy pink cotton kurta with minimal embroidery, perfect for everyday chic wear.",
    category: "Eastern Pret",
    price: 2490,
    originalPrice: 4990,
    discount: "50%",
    stock: 30,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pink", "Blush"],
    reviews: [],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 5,
    name: "Unstitched Lawn 3-Piece",
    description: "Olive green digital printed lawn shirt with embroidered voile dupatta and dyed cambric trouser.",
    category: "Unstitched",
    price: 3990,
    originalPrice: null,
    discount: null,
    stock: 40,
    sizes: ["Unstitched"],
    colors: ["Olive Green"],
    reviews: [
      {
        id: 1,
        reviewerName: "Zainab R.",
        rating: 5,
        comment: "Colors stayed bright after washing. Outstanding lawn texture.",
        createdAt: "2026-10-28T09:15:00.000Z"
      }
    ],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 6,
    name: "Festive Velvet & Lawn Ensemble",
    description: "Emerald green winter formal featuring plush micro-velvet shirt paired with heavy tilla embroidery.",
    category: "Eastern Pret",
    price: 12990,
    originalPrice: 15990,
    discount: "18%",
    stock: 8,
    sizes: ["S", "M", "L"],
    colors: ["Emerald"],
    reviews: [],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 7,
    name: "Chikankari Kurta",
    description: "Crisp ivory white kurta enriched with traditional hand-guided chikankari thread patterns.",
    category: "Eastern Pret",
    price: 4490,
    originalPrice: 5490,
    discount: "18%",
    stock: 22,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White"],
    reviews: [],
    createdAt: "2026-10-25T10:00:00.000Z"
  },
  {
    id: 8,
    name: "Embroidered Formal Suit",
    description: "Jet black signature festive suit highlighted with gilded antique gold threadwork and organza borders.",
    category: "Eastern Pret",
    price: 9990,
    originalPrice: null,
    discount: null,
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal"],
    reviews: [
      {
        id: 1,
        reviewerName: "Hira M.",
        rating: 5,
        comment: "Pure royal elegance. The black and gold combination is unmatched.",
        createdAt: "2026-10-29T16:00:00.000Z"
      }
    ],
    createdAt: "2026-10-25T10:00:00.000Z"
  }
];
