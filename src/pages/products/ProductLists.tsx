import { Link } from "react-router-dom";

const ProductLists = ({ products }: { products: any }) => {
  return (
    <div>
      {products.map((product: any) => (
        <div key={product.id}>
          <Link to={`/products/${product.id}`}>
            {product.title}
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            {product.images.map((image: any) => (
              <div key={image.id}>
                <img
                  src={image.url}
                  alt={image.altText}
                  className="h-50 w-50"
                />
              </div>
            ))}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductLists;
