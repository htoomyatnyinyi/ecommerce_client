import { Link } from "react-router-dom";

const ProductLists = ({ products }: { products: any }) => {
  console.log(products, "products");
  return (
    <div className="">
      <div>
        <div className="">
          {products.map((product: any) => (
            <div key={product.id}>
              <Link to={`/products/${product.id}`}>
                <h3>{product.title}</h3>
                <div>
                  {product.description && (
                    <p className="text-gray-600">{product.description}</p>
                  )}
                </div>
                <div className="flex">
                  {product.images.map((image: any, index: number) => (
                    <div key={image.id}>
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="h-100 w-100"
                      />
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductLists;
