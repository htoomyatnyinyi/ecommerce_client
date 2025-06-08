export interface Product {
  id: string;
  title: string;
  description: string;
  variants: Variant[];
  images: Image[];
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  variant: Variant;
}
