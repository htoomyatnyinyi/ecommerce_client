import { useState } from "react";
import {
  useCreateNewCategoryMutation,
  useCreateNewProductMutation,
  useGetCategoryQuery,
} from "@/redux/query/productApi";

interface VariantOption {
  attributeName: string;
  attributeValue: string;
}

interface Variant {
  sku: string;
  price: string;
  stock: number;
  variantOptions: VariantOption[];
}

interface Image {
  url: string;
  altText: string;
  isPrimary: boolean;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string | null; // Add categoryId to formData
  newCategoryName: string; // For creating a new category
  variants: Variant[];
  images: Image[];
}

interface Category {
  id: string;
  categoryName: string;
}

const ProductForm: React.FC = () => {
  const [createNewProduct, { isLoading: isCreateNewProductLoading }] =
    useCreateNewProductMutation();
  const [createNewCategory, { isLoading: isCreatingNewCategoryLoading }] =
    useCreateNewCategoryMutation();
  const { data: categories = [], isLoading: isGetCategoriesLoading } =
    useGetCategoryQuery();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null); // For validation errors

  const [formData, setFormData] = useState<FormData>({
    title: "T Shirt",
    description: "this t shirt is 100 % cotton",
    categoryId: null,
    newCategoryName: "",
    variants: [
      {
        sku: "SKU-101",
        price: "39",
        stock: 10,
        variantOptions: [
          { attributeName: "color", attributeValue: "green" },
          { attributeName: "size", attributeValue: "M" },
        ],
      },
      {
        sku: "SKU-102",
        price: "40",
        stock: 20,
        variantOptions: [
          { attributeName: "color", attributeValue: "black" },
          { attributeName: "size", attributeValue: "L" },
        ],
      },
    ],
    images: [
      {
        url: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        altText: "pixel image",
        isPrimary: true,
      },
      {
        url: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        altText: "pixel image",
        isPrimary: false, // Fixed: Only one image should be primary
      },
    ],
  });

  if (
    isCreateNewProductLoading ||
    isCreatingNewCategoryLoading ||
    isGetCategoriesLoading
  ) {
    return <p>Loading...</p>;
  }

  // Handle input changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError(null); // Clear error on input change
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantOptionChange = (
    variantIndex: number,
    optionIndex: number,
    field: keyof VariantOption,
    value: string
  ) => {
    const newVariants = [...formData.variants];
    const newOptions = [...newVariants[variantIndex].variantOptions];
    newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
    newVariants[variantIndex].variantOptions = newOptions;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageChange = (index: number, field: keyof Image, value: any) => {
    const newImages = [...formData.images];
    if (field === "isPrimary" && value) {
      newImages.forEach((img, i) => (img.isPrimary = i === index));
    } else {
      newImages[index] = { ...newImages[index], [field]: value };
    }
    setFormData({ ...formData, images: newImages });
  };

  // Add/remove variants and images
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { sku: "", price: "", stock: 0, variantOptions: [] },
      ],
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const addVariantOption = (variantIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].variantOptions.push({
      attributeName: "",
      attributeValue: "",
    });
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].variantOptions = newVariants[
      variantIndex
    ].variantOptions.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, variants: newVariants });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        { url: "", altText: "", isPrimary: formData.images.length === 0 },
      ],
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    if (!newImages.some((img) => img.isPrimary) && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    setFormData({ ...formData, images: newImages });
  };

  // Validate form data
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.categoryId && !formData.newCategoryName.trim()) {
      return "Please select a category or enter a new category name";
    }
    if (formData.variants.length === 0)
      return "At least one variant is required";
    for (const variant of formData.variants) {
      if (!variant.sku.trim()) return "SKU is required for all variants";
      if (!variant.price.trim()) return "Price is required for all variants";
      if (variant.stock < 0) return "Stock cannot be negative";
      if (variant.variantOptions.length === 0)
        return "At least one variant option is required";
      for (const option of variant.variantOptions) {
        if (!option.attributeName.trim() || !option.attributeValue.trim()) {
          return "All variant options must have a name and value";
        }
      }
    }
    if (formData.images.length === 0) return "At least one image is required";
    if (!formData.images.some((img) => img.isPrimary))
      return "One image must be set as primary";
    for (const image of formData.images) {
      if (!image.url.trim()) return "Image URL is required";
      if (!image.altText.trim()) return "Alt text is required for all images";
    }
    return null;
  };

  // Navigation and submission
  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let categoryId = formData.categoryId;

      // Create new category if newCategoryName is provided
      if (!categoryId && formData.newCategoryName.trim()) {
        const categoryResponse = await createNewCategory({
          name: formData.newCategoryName,
        }).unwrap();
        categoryId = categoryResponse.id; // Assuming the response includes the new category ID
      }

      if (!categoryId) {
        setError("Category is required");
        return;
      }

      // Prepare payload for product creation
      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId, // Include categoryId
        variants: formData.variants.map((variant) => ({
          ...variant,
          options: variant.variantOptions, // Rename for backend
          variantOptions: undefined,
        })),
        images: formData.images,
      };

      const response = await createNewProduct(payload).unwrap();
      console.log("Product created:", response);
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Product
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 text-center py-2 rounded-md ${
              step === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Step {s}:{" "}
            {s === 1 ? "Product Info" : s === 2 ? "Variants" : "Images"}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 1: Product Information
            </h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={formData.categoryId || ""}
                onChange={(e) =>
                  handleChange("categoryId", e.target.value || null)
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newCategory" className="block text-gray-700">
                Or Create New Category
              </label>
              <input
                id="newCategory"
                type="text"
                value={formData.newCategoryName}
                onChange={(e) =>
                  handleChange("newCategoryName", e.target.value)
                }
                placeholder="Enter new category name"
                className="w-full p-2 border rounded-md"
                disabled={!!formData.categoryId} // Disable if a category is selected
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 2: Variants
            </h2>
            {formData.variants.map((variant, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium">Variant {index + 1}</h3>
                <div className="mb-2">
                  <label
                    htmlFor={`sku-${index}`}
                    className="block text-gray-700"
                  >
                    SKU
                  </label>
                  <input
                    id={`sku-${index}`}
                    type="text"
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`price-${index}`}
                    className="block text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    id={`price-${index}`}
                    type="text"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`stock-${index}`}
                    className="block text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    id={`stock-${index}`}
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "stock",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Variant Options</h4>
                  {variant.variantOptions.map((option, optIndex) => (
                    <div key={optIndex} className="flex space-x-2 mt-2">
                      <div className="flex-1">
                        <label
                          htmlFor={`attr-name-${index}-${optIndex}`}
                          className="block text-gray-700"
                        >
                          Attribute Name
                        </label>
                        <input
                          id={`attr-name-${index}-${optIndex}`}
                          type="text"
                          value={option.attributeName}
                          onChange={(e) =>
                            handleVariantOptionChange(
                              index,
                              optIndex,
                              "attributeName",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={`attr-value-${index}-${optIndex}`}
                          className="block text-gray-700"
                        >
                          Attribute Value
                        </label>
                        <input
                          id={`attr-value-${index}-${optIndex}`}
                          type="text"
                          value={option.attributeValue}
                          onChange={(e) =>
                            handleVariantOptionChange(
                              index,
                              optIndex,
                              "attributeValue",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => removeVariantOption(index, optIndex)}
                        className="mt-6 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addVariantOption(index)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>
                {formData.variants.length > 1 && (
                  <button
                    onClick={() => removeVariant(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addVariant}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              + Add Variant
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 3: Images
            </h2>
            {formData.images.map((image, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="mb-2">
                  <label
                    htmlFor={`url-${index}`}
                    className="block text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    id={`url-${index}`}
                    type="text"
                    value={image.url}
                    onChange={(e) =>
                      handleImageChange(index, "url", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`altText-${index}`}
                    className="block text-gray-700"
                  >
                    Alt Text
                  </label>
                  <input
                    id={`altText-${index}`}
                    type="text"
                    value={image.altText}
                    onChange={(e) =>
                      handleImageChange(index, "altText", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id={`isPrimary-${index}`}
                    type="checkbox"
                    checked={image.isPrimary}
                    onChange={(e) =>
                      handleImageChange(index, "isPrimary", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor={`isPrimary-${index}`}>Primary Image</label>
                </div>
                {formData.images.length > 1 && (
                  <button
                    onClick={() => removeImage(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addImage}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              + Add Image
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ml-auto"
          >
            {step === 3 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
// import { useState } from "react";
// import {
//   useCreateNewCategoryMutation,
//   useCreateNewProductMutation,
//   useGetCategoryQuery,
// } from "@/redux/query/productApi";

// interface VariantOption {
//   attributeName: string;
//   attributeValue: string;
// }

// interface Variant {
//   sku: string;
//   price: string;
//   stock: number;
//   variantOptions: VariantOption[];
// }

// interface Image {
//   url: string;
//   altText: string;
//   isPrimary: boolean;
// }

// interface FormData {
//   title: string;
//   description: string;
//   variants: Variant[];
//   images: Image[];
// }

// const ProductForm: React.FC = () => {
//   // const dispatch = useDispatch();
//   const [createNewProduct, { isLoading: isCreateNewProductLoading }] =
//     useCreateNewProductMutation();
//   const [createNewCategory, { isLoading: isCreatingNewCategoryLoading }] =
//     useCreateNewCategoryMutation();

//   if (isCreateNewProductLoading) return <p>Loading</p>;
//   if (isCreatingNewCategoryLoading) return <p>Loading</p>;

//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState<FormData>({
//     title: "T Shirt",
//     description: " this t shirt is 100 % cotton",
//     variants: [
//       {
//         sku: "SKU-101",
//         price: "39",
//         stock: 10,
//         variantOptions: [
//           {
//             attributeName: "color",
//             attributeValue: "green",
//           },
//           {
//             attributeName: "size",
//             attributeValue: "M",
//           },
//         ],
//       },
//       {
//         sku: "SKU-102",
//         price: "40",
//         stock: 20,
//         variantOptions: [
//           {
//             attributeName: "color",
//             attributeValue: "black",
//           },
//           {
//             attributeName: "size",
//             attributeValue: "L",
//           },
//         ],
//       },
//     ],
//     images: [
//       {
//         url: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//         altText: "pixel imag",
//         isPrimary: true,
//       },
//       {
//         url: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//         altText: "pixel imag",
//         isPrimary: true,
//       },
//     ],
//   });

//   const { data: getCategories, isLoading: isGetCategoriesLoading } =
//     useGetCategoryQuery();

//   if (isGetCategoriesLoading) return <p>Loading</p>;
//   console.log(getCategories, "pf");

//   // Handle input changes
//   const handleChange = (field: keyof FormData, value: any) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleVariantChange = (
//     index: number,
//     field: keyof Variant,
//     value: any
//   ) => {
//     const newVariants = [...formData.variants];
//     newVariants[index] = { ...newVariants[index], [field]: value };
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const handleVariantOptionChange = (
//     variantIndex: number,
//     optionIndex: number,
//     field: keyof VariantOption,
//     value: string
//   ) => {
//     const newVariants = [...formData.variants];
//     const newOptions = [...newVariants[variantIndex].variantOptions];
//     newOptions[optionIndex] = {
//       ...newOptions[optionIndex],
//       [field]: value,
//     };
//     newVariants[variantIndex].variantOptions = newOptions;
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const handleImageChange = (index: number, field: keyof Image, value: any) => {
//     const newImages = [...formData.images];
//     if (field === "isPrimary" && value) {
//       newImages.forEach((img, i) => (img.isPrimary = i === index));
//     } else {
//       newImages[index] = { ...newImages[index], [field]: value };
//     }
//     setFormData({ ...formData, images: newImages });
//   };

//   // Add/remove variants and images
//   const addVariant = () => {
//     setFormData({
//       ...formData,
//       variants: [
//         ...formData.variants,
//         { sku: "", price: "", stock: 0, variantOptions: [] },
//       ],
//     });
//   };

//   const removeVariant = (index: number) => {
//     setFormData({
//       ...formData,
//       variants: formData.variants.filter((_, i) => i !== index),
//     });
//   };

//   const addVariantOption = (variantIndex: number) => {
//     const newVariants = [...formData.variants];
//     newVariants[variantIndex].variantOptions.push({
//       attributeName: "",
//       attributeValue: "",
//     });
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const removeVariantOption = (variantIndex: number, optionIndex: number) => {
//     const newVariants = [...formData.variants];
//     newVariants[variantIndex].variantOptions = newVariants[
//       variantIndex
//     ].variantOptions.filter((_, i) => i !== optionIndex);
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const addImage = () => {
//     setFormData({
//       ...formData,
//       images: [
//         ...formData.images,
//         { url: "", altText: "", isPrimary: formData.images.length === 0 },
//       ],
//     });
//   };

//   const removeImage = (index: number) => {
//     const newImages = formData.images.filter((_, i) => i !== index);
//     if (!newImages.some((img) => img.isPrimary) && newImages.length > 0) {
//       newImages[0].isPrimary = true;
//     }
//     setFormData({ ...formData, images: newImages });
//   };

//   // Navigation and submission
//   // const nextStep = async () => {
//   //   if (step < 3) setStep(step + 1);
//   //   // else console.log("Submitting product:", formData);
//   //   else {
//   //     try {
//   //       const response = await createNewProduct(formData);
//   //       console.log(response, " return data check");
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   }
//   // };

//   const nextStep = async () => {
//     if (step < 3) {
//       setStep(step + 1);
//     } else {
//       // Transform data before submission
//       const payload = {
//         ...formData,
//         variants: formData.variants.map((variant) => ({
//           ...variant,
//           options: variant.variantOptions, // Rename `variantOptions` → `options`
//           variantOptions: undefined, // Remove the old key (optional)
//         })),
//       };

//       try {
//         const response = await createNewProduct(payload);
//         console.log(response, " return data check");
//       } catch (error) {
//         console.error(error);
//       }

//       console.log("Submitting:", payload);
//       // Example: dispatch(createProduct(payload));
//     }
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">
//         Create New Product
//       </h1>
//       <div className="flex justify-between mb-6">
//         {[1, 2, 3].map((s) => (
//           <div
//             key={s}
//             className={`flex-1 text-center py-2 rounded-md ${
//               step === s
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Step {s}:{" "}
//             {s === 1 ? "Product Info" : s === 2 ? "Variants" : "Images"}
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         {step === 1 && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Step 1: Product Information
//             </h2>
//             <div className="mb-4">
//               <label htmlFor="title" className="block text-gray-700">
//                 Title
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => handleChange("title", e.target.value)}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="description" className="block text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => handleChange("description", e.target.value)}
//                 className="w-full p-2 border rounded-md"
//                 rows={4}
//               />
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Step 2: Variants
//             </h2>
//             {formData.variants.map((variant, index) => (
//               <div key={index} className="mb-4 p-4 border rounded-md">
//                 <h3 className="text-lg font-medium">Variant {index + 1}</h3>
//                 <div className="mb-2">
//                   <label
//                     htmlFor={`sku-${index}`}
//                     className="block text-gray-700"
//                   >
//                     SKU
//                   </label>
//                   <input
//                     id={`sku-${index}`}
//                     type="text"
//                     value={variant.sku}
//                     onChange={(e) =>
//                       handleVariantChange(index, "sku", e.target.value)
//                     }
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label
//                     htmlFor={`price-${index}`}
//                     className="block text-gray-700"
//                   >
//                     Price
//                   </label>
//                   <input
//                     id={`price-${index}`}
//                     type="text"
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleVariantChange(index, "price", e.target.value)
//                     }
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label
//                     htmlFor={`stock-${index}`}
//                     className="block text-gray-700"
//                   >
//                     Stock
//                   </label>
//                   <input
//                     id={`stock-${index}`}
//                     type="number"
//                     value={variant.stock}
//                     onChange={(e) =>
//                       handleVariantChange(
//                         index,
//                         "stock",
//                         parseInt(e.target.value) || 0
//                       )
//                     }
//                     className="w-full p-2 border rounded-md"
//                     min="0"
//                   />
//                 </div>
//                 <div className="mt-2">
//                   <h4 className="text-sm font-medium">Variant Options</h4>
//                   {variant.variantOptions.map((option, optIndex) => (
//                     <div key={optIndex} className="flex space-x-2 mt-2">
//                       <div className="flex-1">
//                         <label
//                           htmlFor={`attr-name-${index}-${optIndex}`}
//                           className="block text-gray-700"
//                         >
//                           Attribute Name
//                         </label>
//                         <input
//                           id={`attr-name-${index}-${optIndex}`}
//                           type="text"
//                           value={option.attributeName}
//                           onChange={(e) =>
//                             handleVariantOptionChange(
//                               index,
//                               optIndex,
//                               "attributeName",
//                               e.target.value
//                             )
//                           }
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label
//                           htmlFor={`attr-value-${index}-${optIndex}`}
//                           className="block text-gray-700"
//                         >
//                           Attribute Value
//                         </label>
//                         <input
//                           id={`attr-value-${index}-${optIndex}`}
//                           type="text"
//                           value={option.attributeValue}
//                           onChange={(e) =>
//                             handleVariantOptionChange(
//                               index,
//                               optIndex,
//                               "attributeValue",
//                               e.target.value
//                             )
//                           }
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>
//                       <button
//                         onClick={() => removeVariantOption(index, optIndex)}
//                         className="mt-6 text-red-500 hover:text-red-700"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     onClick={() => addVariantOption(index)}
//                     className="mt-2 text-blue-600 hover:text-blue-800"
//                   >
//                     + Add Option
//                   </button>
//                 </div>
//                 {formData.variants.length > 1 && (
//                   <button
//                     onClick={() => removeVariant(index)}
//                     className="mt-2 text-red-500 hover:text-red-700"
//                   >
//                     Remove Variant
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               onClick={addVariant}
//               className="mt-4 text-blue-600 hover:text-blue-800"
//             >
//               + Add Variant
//             </button>
//           </div>
//         )}

//         {step === 3 && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Step 3: Images
//             </h2>
//             {formData.images.map((image, index) => (
//               <div key={index} className="mb-4 p-4 border rounded-md">
//                 <div className="mb-2">
//                   <label
//                     htmlFor={`url-${index}`}
//                     className="block text-gray-700"
//                   >
//                     Image URL
//                   </label>
//                   <input
//                     id={`url-${index}`}
//                     type="text"
//                     value={image.url}
//                     onChange={(e) =>
//                       handleImageChange(index, "url", e.target.value)
//                     }
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label
//                     htmlFor={`altText-${index}`}
//                     className="block text-gray-700"
//                   >
//                     Alt Text
//                   </label>
//                   <input
//                     id={`altText-${index}`}
//                     type="text"
//                     value={image.altText}
//                     onChange={(e) =>
//                       handleImageChange(index, "altText", e.target.value)
//                     }
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     id={`isPrimary-${index}`}
//                     type="checkbox"
//                     checked={image.isPrimary}
//                     onChange={(e) =>
//                       handleImageChange(index, "isPrimary", e.target.checked)
//                     }
//                     className="mr-2"
//                   />
//                   <label htmlFor={`isPrimary-${index}`}>Primary Image</label>
//                 </div>
//                 {formData.images.length > 1 && (
//                   <button
//                     onClick={() => removeImage(index)}
//                     className="mt-2 text-red-500 hover:text-red-700"
//                   >
//                     Remove Image
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               onClick={addImage}
//               className="mt-4 text-blue-600 hover:text-blue-800"
//             >
//               + Add Image
//             </button>
//           </div>
//         )}

//         <div className="mt-6 flex justify-between">
//           {step > 1 && (
//             <button
//               onClick={prevStep}
//               className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
//             >
//               Previous
//             </button>
//           )}
//           <button
//             onClick={nextStep}
//             className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ml-auto"
//           >
//             {step === 3 ? "Submit" : "Next"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;

// // import React, { useState } from "react";

// // interface FormData {
// //   title: string;
// //   description: string;
// //   variants: Variant[];
// //   images: Image[];
// // }
// // interface Variant {
// //   sku: string;
// //   price: string;
// //   stock: number;
// //   variantOptions: VariantOption[];
// // }

// // interface VariantOption {
// //   attributeName: string;
// //   attributeValue: string;
// // }

// // interface Image {
// //   url: string;
// //   altText: string;
// //   isPrimary: boolean;
// // }

// // const ProductForm: React.FC = () => {
// //   // progress bar
// //   const [step, setStep] = useState(1);

// //   // post form
// //   const [formData, setFormData] = useState<FormData>({
// //     title: "",
// //     description: "",
// //     variants: [
// //       {
// //         sku: "",
// //         price: "",
// //         stock: 0,
// //         variantOptions: [
// //           {
// //             attributeName: "",
// //             attributeValue: "",
// //           },
// //         ],
// //       },
// //     ],
// //     images: [
// //       {
// //         url: "string",
// //         altText: "string",
// //         isPrimary: true,
// //       },
// //     ],
// //   });

// //   // Handle Input Change for dynamic field {...formData, title: 'new data'} # formData.title = new data
// //   const handleChange = (field: any, value: any) => {
// //     setFormData({ ...formData, [field]: value });
// //   };

// //   // Navigation and submission
// //   const nextStep = async () => {
// //     if (step < 3) setStep(step + 1);
// //     // else console.log("Submitting product:", formData);
// //     else {
// //       console.log(formData, "check at post");
// //       try {
// //         return; // temp
// //         // const response = await createNewProduct(formData);
// //         // console.log(response, "submitted response ");
// //       } catch (error) {
// //         console.error(error);
// //       }
// //     }
// //   };

// //   const prevStep = () => {
// //     setStep(step - 1);
// //   };

// //   return (
// //     <div>
// //       {/* Progress Bar Logic */}
// //       <div className="flex justify-between mb-6">
// //         {[1, 2, 3].map((status) => (
// //           <div
// //             key={status}
// //             className={`flex-1 text-center py-2 rounded-md m-2 ${
// //               step === status
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 text-gray-700"
// //             }`}
// //           >
// //             Step {status}:{" "}
// //             {status === 1
// //               ? "Product Info"
// //               : status === 2
// //               ? "Variants Product/"
// //               : "Images "}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Form  */}
// //       <div className="p-6 ">
// //         <div>
// //           {step === 1 && (
// //             <div>
// //               <h2 className="text-xl  mb-4">Step 1: Product Information</h2>
// //               <div className="mb-4">
// //                 <label htmlFor="title" className="block ">
// //                   Title
// //                 </label>
// //                 <input
// //                   id="title"
// //                   type="text"
// //                   value={formData.title}
// //                   onChange={(e) => handleChange("title", e.target.value)}
// //                   className="w-full p-2 border rounded-md"
// //                 />
// //               </div>
// //               <div className="mb-4">
// //                 <label htmlFor="description" className="block ">
// //                   Description
// //                 </label>
// //                 <textarea
// //                   id="description"
// //                   value={formData.description}
// //                   onChange={(e) => handleChange("description", e.target.value)}
// //                   className="w-full p-2 border rounded-md"
// //                   rows={4}
// //                 />
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         <div>
// //           {step === 2 && (
// //             <div>
// //               <h2>Setp 2: Variants</h2>
// //               <div>
// //                 {formData.variants.map((variant, index) => (
// //                   <div key={index}>
// //                     <input
// //                       type="text"
// //                       value={variant.sku}
// //                       onChange={(e) => handleChange("sku", e.target.value)}
// //                       placeholder="sku"
// //                       className="p-2 m-1 border"
// //                     />
// //                     <input
// //                       type="text"
// //                       value={variant.price}
// //                       onChange={(e) => handleChange("price", e.target.value)}
// //                       placeholder="price"
// //                       className="p-2 m-1 border"
// //                     />
// //                     <input
// //                       type="text"
// //                       value={variant.stock}
// //                       onChange={(e) => handleChange("stock", e.target.value)}
// //                       placeholder="stock"
// //                       className="p-2 m-1 border"
// //                     />
// //                     <div>
// //                       {variant.variantOptions.map((attributeOptions) => (
// //                         <div>
// //                           <input
// //                             type="text"
// //                             value={attributeOptions.attributeName}
// //                             onChange={(e) =>
// //                               handleChange("attributeName", e.target.value)
// //                             }
// //                             placeholder="attributeName"
// //                             className="p-2 m-1 border"
// //                           />
// //                           <input
// //                             type="text"
// //                             value={attributeOptions.attributeValue}
// //                             onChange={(e) =>
// //                               handleChange("attributeValue", e.target.value)
// //                             }
// //                             placeholder="attributeValue"
// //                             className="p-2 m-1 border"
// //                           />
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         <div>
// //           {step === 3 && (
// //             <div>
// //               <h2>Setp 3: Images</h2>
// //             </div>
// //           )}
// //         </div>

// //         {/* setup step */}
// //         <div>
// //           {step > 1 && (
// //             <button onClick={prevStep} className="p-2 m-1 border">
// //               Previous
// //             </button>
// //           )}
// //           <button onClick={nextStep} className="p-2 m-1 border">
// //             {step === 3 ? "Submit" : "Next"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductForm;
