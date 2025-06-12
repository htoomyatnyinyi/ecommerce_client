import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageCarousel from "./ImageCarousel";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slice/cartSlice";
import ProductDetailsDialog from "./ProductDetailsDialog";
import type { RootState } from "@/redux/store/store";
// interface ProductProps {
//   product: {
//     id: number;
//     title: string;
//     description: string;
//     categoryId: number;
//     userId: number;
//     createdAt: string;
//     updatedAt: string;
//     variants: Array<{
//       id: number;
//       sku: string;
//       price: number;
//       discountPrice?: number;
//       stock: number;
//       isActive: boolean;
//       productId: number;
//       createdAt: string;
//       updatedAt: string;
//       variantOptions: Array<{
//         id: number;
//         attributeName: string;
//         attributeValue: string;
//         attributeStock: number;
//         variantId: number;
//       }>;
//     }>;
// }

// This is a simple ProductCard component that displays product information using a card layout.
const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const dispatch = useDispatch();

  const quantity = useSelector((state: RootState) => state.cart.items);
  console.log(quantity);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          {/* <CardAction>
            <button
              onClick={() => dispatch(addToCart(product))}
              className="text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
            >
              Add to Cart
            </button>
          </CardAction> */}
          <CardAction>
            {/* View Details */}
            <ProductDetailsDialog />
            {/* <button className="text-blue-500 border hover:bg-blue-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md">
            </button> */}
          </CardAction>
        </CardHeader>
        <CardContent>
          <ImageCarousel product_image={product.images} />
          {/* <p>Card Content</p> */}
        </CardContent>
        <CardFooter>
          {/* <p>Card Footer</p> */}
          <button
            onClick={() => dispatch(addToCart(product))}
            className="text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
          >
            Add to Cart
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;

// interface ProductProps {
//   id: number;
//   title: string;
//   description: string;
//   categoryId: number;
//   userId: number;
//   createdAt: string;
//   updatedAt: string;
//   variants: Array<{
//     id: number;
//     sku: string;
//     price: number;
//     discountPrice?: number;
//     stock: number;
//     isActive: boolean;
//     productId: number;
//     createdAt: string;
//     updatedAt: string;
//     variantOptions: Array<{
//       id: number;
//       attributeName: string;
//       attributeValue: string;
//       attributeStock: number;
//       variantId: number;
//     }>;
//   }>;
//   category: {
//     id: number;
//     categoryName: string;
//   };
//   images: Array<{
//     id: number;
//     url: string;
//     altText: string;
//   }>;
// }
