import React from "react";
import { Link } from "react-router-dom";
import { useGetCategoryQuery } from "@/redux/query/productApi";
import { ArrowRight } from "lucide-react";

const FeaturedCategories: React.FC = () => {
  const { data: categoriesResponse, isLoading } = useGetCategoryQuery();
  const categories = categoriesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-10 w-48 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-4/5 bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // Fallback categories if none found in API
  const displayCategories =
    categories?.length > 0
      ? categories
      : [
          {
            id: "1",
            categoryName: "Essentials",
            image:
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
          },
          {
            id: "2",
            categoryName: "Premium Tech",
            image:
              "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2012&auto=format&fit=crop",
          },
          {
            id: "3",
            categoryName: "Home Living",
            image:
              "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2070&auto=format&fit=crop",
          },
          {
            id: "4",
            categoryName: "Fashion",
            image:
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop",
          },
        ];

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Explore Our <span className="text-primary">Curated</span>{" "}
              Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Find exactly what you're looking for by browsing through our
              hand-picked collections.
            </p>
          </div>
          <Link
            to="/products"
            className="group flex items-center text-primary font-bold text-lg hover:underline decoration-2 underline-offset-8"
          >
            View All Collections
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.slice(0, 4).map((category: any) => (
            <Link
              key={category.id}
              to={`/products?category=${category.categoryName}`}
              className="group relative aspect-4/5 rounded-3xl overflow-hidden bg-muted"
            >
              <img
                src={
                  category.image ||
                  `https://source.unsplash.com/featured/?${category.categoryName}`
                }
                alt={category.categoryName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 w-full transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-white/70 text-sm font-medium uppercase tracking-[0.2em] mb-2">
                  Collection
                </p>
                <h3 className="text-white text-3xl font-bold">
                  {category.categoryName}
                </h3>
                <div className="mt-4 flex items-center text-white/0 group-hover:text-white transition-all duration-500">
                  <span className="text-sm font-bold mr-2">Explore Items</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
