import React, { useState } from "react";

// Define a type for the image object for better safety
interface ProductImage {
  url: string;
  altText: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
}) => {
  // Use state to track the currently selected image
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        No Image
      </div>
    );
  }

  return (
    <div>
      {/* Main Image Display */}
      <div className="bg-white/5 rounded-lg mb-4 overflow-hidden">
        <img
          src={mainImage.url}
          alt={mainImage.altText}
          className="w-full h-96 object-cover transition-transform duration-300 ease-in-out"
        />
      </div>
      {/* Thumbnail Selector */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-md overflow-hidden border-2 ${
              mainImage.url === image.url
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => setMainImage(image)}
          >
            <img
              src={image.url}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
