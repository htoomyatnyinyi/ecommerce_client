export interface VariantOption {
  id: string;
  attributeName: string;
  attributeValue: string;
  variantId: string;
}

export interface Variant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  variantOptions: VariantOption[];
}

export interface Image {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updateAt: string;
  userId: string;
  categoryId: string | null;
  brandId: string | null;
  variants: Variant[];
  images: Image[];
  category: string | null;
  brand: string | null;
  quantity: number;
  selectedVariantId?: string; // Track selected variant
}

// export interface Product {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   updateAt: string;
//   userId: string;
//   categoryId: string | null;
//   brandId: string | null;
//   variants: Variant[];
//   images: Image[];
//   category: string | null;
//   brand: string | null;
//   quantity: number;
//   selectedVariantId?: string; // Track selected variant
// }

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: Variant;
}

export interface Category {
  id: string;
  categoryName: string;
}
