import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  product_image: any;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ product_image }) => {
  console.log(product_image, "Image Carousel Component");

  return (
    <div>
      <Carousel>
        <div>
          <CarouselContent>
            {product_image.map((image: any) => (
              <CarouselItem key={image.id} className="w-full h-full">
                <img
                  src={image.url}
                  alt={image.altText}
                  className="object-cover w-full h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <img
              src="https://picsum.photos/800/400?random=1"
              alt="Random Image 1"
              className="object-cover w-full h-full"
            /> */}
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            Previous
          </CarouselPrevious>
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            Next
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;

{
  /* <div>
        <Carousel className="w-full h-96">
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            Previous
          </CarouselPrevious>
          <CarouselContent className="flex gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={`https://picsum.photos/800/400?random=${index}`}
                  alt={`Random Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            Next
          </CarouselNext>
        </Carousel>
      </div> */
}
