import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slice/cartSlice";

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
  variants: Variant[];
  images: Image[];
}

const ProductForm: React.FC = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    variants: [{ sku: "", price: "", stock: 0, variantOptions: [] }], // Initialize with empty variantOptions
    images: [{ url: "", altText: "", isPrimary: true }],
  });
  const [errors, setErrors] = useState<
    Partial<
      FormData & { variants: Partial<Variant>[]; images: Partial<Image>[] }
    >
  >({});

  // Validation for Step 2 (Variants)
  const validateStep2 = () => {
    const newErrors: { variants: Partial<Variant>[] } = { variants: [] };
    let hasValidVariant = false;

    formData.variants.forEach((variant, index) => {
      const variantErrors: Partial<Variant> = {};
      if (
        variant.sku.trim() ||
        variant.price.trim() ||
        variant.stock > 0 ||
        variant.variantOptions.length > 0
      ) {
        // Only validate if the variant has some input
        if (!variant.sku.trim()) variantErrors.sku = "SKU is required";
        if (!variant.price.trim()) variantErrors.price = "Price is required";
        else if (!/^\d+(\.\d{1,2})?$/.test(variant.price))
          variantErrors.price = "Price must be a valid number (e.g., 19.99)";
        if (variant.stock < 0) variantErrors.stock = "Stock cannot be negative";
        if (variant.variantOptions.length > 0) {
          variantErrors.variantOptions = variant.variantOptions.map((opt) => ({
            attributeName: opt.attributeName.trim()
              ? ""
              : "Attribute name is required",
            attributeValue: opt.attributeValue.trim()
              ? ""
              : "Attribute value is required",
          }));
        }
        if (
          Object.values(variantErrors).every((e) => !e) && // No errors in fields
          (!variant.variantOptions.length || // No options, or all options are valid
            variant.variantOptions.every(
              (opt) => opt.attributeName.trim() && opt.attributeValue.trim()
            ))
        ) {
          hasValidVariant = true;
        }
      }
      newErrors.variants[index] = variantErrors;
    });

    setErrors(newErrors);
    return (
      hasValidVariant ||
      formData.variants.every(
        (v) =>
          !v.sku.trim() &&
          !v.price.trim() &&
          v.stock === 0 &&
          v.variantOptions.length === 0
      )
    );
  };

  // Validation for Step 3 (Images)
  const validateStep3 = () => {
    const newErrors: { images: Partial<Image>[] } = { images: [] };
    const hasPrimary = formData.images.some((img) => img.isPrimary);
    formData.images.forEach((image, index) => {
      const imageErrors: Partial<Image> = {};
      if (!image.url.trim()) imageErrors.url = "Image URL is required";
      else if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(image.url))
        imageErrors.url = "Invalid URL format";
      if (!image.altText.trim()) imageErrors.altText = "Alt text is required";
      if (!hasPrimary)
        imageErrors.isPrimary = "At least one image must be primary";
      newErrors.images[index] = imageErrors;
    });
    setErrors(newErrors);
    return (
      newErrors.images.every((i) => Object.values(i).every((e) => !e)) &&
      hasPrimary
    );
  };

  // Handle input changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
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
    newVariants[variantIndex].variantOptions[optionIndex] = {
      ...newVariants[variantIndex].variantOptions[optionIndex],
      [field]: value,
    };
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

  // Navigation and submission
  const nextStep = () => {
    if (step === 1) setStep(2); // No validation for Step 1
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) {
      console.log("Submitting product:", formData);
      // Example: dispatch(createProduct(formData));
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Product
      </h1>
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
                aria-label="Product title"
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
                aria-label="Product description"
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
                    aria-label={`SKU for variant ${index + 1}`}
                  />
                  {errors.variants?.[index]?.sku && (
                    <p className="text-red-500 text-sm">
                      {errors.variants[index].sku}
                    </p>
                  )}
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
                    aria-label={`Price for variant ${index + 1}`}
                  />
                  {errors.variants?.[index]?.price && (
                    <p className="text-red-500 text-sm">
                      {errors.variants[index].price}
                    </p>
                  )}
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
                    aria-label={`Stock for variant ${index + 1}`}
                  />
                  {errors.variants?.[index]?.stock && (
                    <p className="text-red-500 text-sm">
                      {errors.variants[index].stock}
                    </p>
                  )}
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
                          aria-label={`Attribute name for variant ${
                            index + 1
                          }, option ${optIndex + 1}`}
                        />
                        {errors.variants?.[index]?.variantOptions?.[optIndex]
                          ?.attributeName && (
                          <p className="text-red-500 text-sm">
                            {
                              errors.variants[index].variantOptions[optIndex]
                                .attributeName
                            }
                          </p>
                        )}
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
                          aria-label={`Attribute value for variant ${
                            index + 1
                          }, option ${optIndex + 1}`}
                        />
                        {errors.variants?.[index]?.variantOptions?.[optIndex]
                          ?.attributeValue && (
                          <p className="text-red-500 text-sm">
                            {
                              errors.variants[index].variantOptions[optIndex]
                                .attributeValue
                            }
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeVariantOption(index, optIndex)}
                        className="mt-6 text-red-500 hover:text-red-700"
                        aria-label={`Remove option ${
                          optIndex + 1
                        } from variant ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addVariantOption(index)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                    aria-label={`Add option to variant ${index + 1}`}
                  >
                    + Add Option
                  </button>
                </div>
                {formData.variants.length > 1 && (
                  <button
                    onClick={() => removeVariant(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                    aria-label={`Remove variant ${index + 1}`}
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addVariant}
              className="mt-4 text-blue-600 hover:text-blue-800"
              aria-label="Add new variant"
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
                    aria-label={`Image URL for image ${index + 1}`}
                  />
                  {errors.images?.[index]?.url && (
                    <p className="text-red-500 text-sm">
                      {errors.images[index].url}
                    </p>
                  )}
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
                    aria-label={`Alt text for image ${index + 1}`}
                  />
                  {errors.images?.[index]?.altText && (
                    <p className="text-red-500 text-sm">
                      {errors.images[index].altText}
                    </p>
                  )}
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
                    aria-label={`Set image ${index + 1} as primary`}
                  />
                  <label htmlFor={`isPrimary-${index}`}>Primary Image</label>
                </div>
                {formData.images.length > 1 && (
                  <button
                    onClick={() => removeImage(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addImage}
              className="mt-4 text-blue-600 hover:text-blue-800"
              aria-label="Add new image"
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
              aria-label="Previous step"
            >
              Previous
            </button>
          )}
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ml-auto"
            aria-label={step === 3 ? "Submit product" : "Next step"}
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
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/redux/slice/cartSlice";

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
//   const dispatch = useDispatch();

//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState<FormData>({
//     title: "",
//     description: "",
//     variants: [
//       {
//         sku: "",
//         price: "",
//         stock: 0,
//         variantOptions: [{ attributeName: "", attributeValue: "" }],
//       },
//     ],
//     images: [{ url: "", altText: "", isPrimary: true }],
//   });

//   const [errors, setErrors] = useState<
//     Partial<
//       FormData & { variants: Partial<Variant>[]; images: Partial<Image>[] }
//     >
//   >({});

//   // Validation functions
//   const validateStep1 = () => {
//     const newErrors: Partial<FormData> = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     else if (formData.title.length < 3)
//       newErrors.title = "Title must be at least 3 characters";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     else if (formData.description.length < 10)
//       newErrors.description = "Description must be at least 10 characters";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateStep2 = () => {
//     const newErrors: { variants: Partial<Variant>[] } = { variants: [] };
//     formData.variants.forEach((variant, index) => {
//       const variantErrors: Partial<Variant> = {};
//       if (!variant.sku.trim()) variantErrors.sku = "SKU is required";
//       if (!variant.price.trim()) variantErrors.price = "Price is required";
//       else if (!/^\d+(\.\d{1,2})?$/.test(variant.price))
//         variantErrors.price = "Price must be a valid number (e.g., 19.99)";
//       if (variant.stock < 0) variantErrors.stock = "Stock cannot be negative";
//       if (variant.variantOptions.length === 0) {
//         variantErrors.variantOptions = [
//           { attributeName: "At least one option is required" },
//         ];
//       } else {
//         variantErrors.variantOptions = variant.variantOptions.map((opt) => ({
//           attributeName: opt.attributeName.trim()
//             ? ""
//             : "Attribute name is required",
//           attributeValue: opt.attributeValue.trim()
//             ? ""
//             : "Attribute value is required",
//         }));
//       }
//       newErrors.variants[index] = variantErrors;
//     });
//     setErrors(newErrors);
//     return newErrors.variants.every((v) => Object.values(v).every((e) => !e));
//   };

//   const validateStep3 = () => {
//     const newErrors: { images: Partial<Image>[] } = { images: [] };
//     const hasPrimary = formData.images.some((img) => img.isPrimary);
//     formData.images.forEach((image, index) => {
//       const imageErrors: Partial<Image> = {};
//       if (!image.url.trim()) imageErrors.url = "Image URL is required";
//       else if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(image.url))
//         imageErrors.url = "Invalid URL format";
//       if (!image.altText.trim()) imageErrors.altText = "Alt text is required";
//       if (!hasPrimary)
//         imageErrors.isPrimary = "At least one image must be primary";
//       newErrors.images[index] = imageErrors;
//     });
//     setErrors(newErrors);

//     return (
//       newErrors.images.every((i) => Object.values(i).every((e) => !e)) &&
//       hasPrimary
//     );
//   };

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
//     newVariants[variantIndex].variantOptions[optionIndex] = {
//       ...newVariants[variantIndex].variantOptions[optionIndex],
//       [field]: value,
//     };
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
//         {
//           sku: "",
//           price: "",
//           stock: 0,
//           variantOptions: [{ attributeName: "", attributeValue: "" }],
//         },
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
//   const nextStep = () => {
//     if (step === 1 && validateStep1()) setStep(2);
//     else if (step === 2 && validateStep2()) setStep(3);
//     else if (step === 3 && validateStep3()) {
//       // Simulate API call
//       console.log("Submitting product:", formData);
//       // Example: dispatch(createProduct(formData));
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
//                 aria-label="Product title"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-sm">{errors.title}</p>
//               )}
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
//                 aria-label="Product description"
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm">{errors.description}</p>
//               )}
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
//                     aria-label={`SKU for variant ${index + 1}`}
//                   />
//                   {errors.variants?.[index]?.sku && (
//                     <p className="text-red-500 text-sm">
//                       {errors.variants[index].sku}
//                     </p>
//                   )}
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
//                     aria-label={`Price for variant ${index + 1}`}
//                   />
//                   {errors.variants?.[index]?.price && (
//                     <p className="text-red-500 text-sm">
//                       {errors.variants[index].price}
//                     </p>
//                   )}
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
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full p-2 border rounded-md"
//                     min="0"
//                     aria-label={`Stock for variant ${index + 1}`}
//                   />
//                   {errors.variants?.[index]?.stock && (
//                     <p className="text-red-500 text-sm">
//                       {errors.variants[index].stock}
//                     </p>
//                   )}
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
//                           aria-label={`Attribute name for variant ${
//                             index + 1
//                           }, option ${optIndex + 1}`}
//                         />
//                         {errors.variants?.[index]?.variantOptions?.[optIndex]
//                           ?.attributeName && (
//                           <p className="text-red-500 text-sm">
//                             {
//                               errors.variants[index].variantOptions[optIndex]
//                                 .attributeName
//                             }
//                           </p>
//                         )}
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
//                           aria-label={`Attribute value for variant ${
//                             index + 1
//                           }, option ${optIndex + 1}`}
//                         />
//                         {errors.variants?.[index]?.variantOptions?.[optIndex]
//                           ?.attributeValue && (
//                           <p className="text-red-500 text-sm">
//                             {
//                               errors.variants[index].variantOptions[optIndex]
//                                 .attributeValue
//                             }
//                           </p>
//                         )}
//                       </div>
//                       <button
//                         onClick={() => removeVariantOption(index, optIndex)}
//                         className="mt-6 text-red-500 hover:text-red-700"
//                         aria-label={`Remove option ${
//                           optIndex + 1
//                         } from variant ${index + 1}`}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     onClick={() => addVariantOption(index)}
//                     className="mt-2 text-blue-600 hover:text-blue-800"
//                     aria-label={`Add option to variant ${index + 1}`}
//                   >
//                     + Add Option
//                   </button>
//                 </div>
//                 {formData.variants.length > 1 && (
//                   <button
//                     onClick={() => removeVariant(index)}
//                     className="mt-2 text-red-500 hover:text-red-700"
//                     aria-label={`Remove variant ${index + 1}`}
//                   >
//                     Remove Variant
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               onClick={addVariant}
//               className="mt-4 text-blue-600 hover:text-blue-800"
//               aria-label="Add new variant"
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
//                     aria-label={`Image URL for image ${index + 1}`}
//                   />
//                   {errors.images?.[index]?.url && (
//                     <p className="text-red-500 text-sm">
//                       {errors.images[index].url}
//                     </p>
//                   )}
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
//                     aria-label={`Alt text for image ${index + 1}`}
//                   />
//                   {errors.images?.[index]?.altText && (
//                     <p className="text-red-500 text-sm">
//                       {errors.images[index].altText}
//                     </p>
//                   )}
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
//                     aria-label={`Set image ${index + 1} as primary`}
//                   />
//                   <label htmlFor={`isPrimary-${index}`}>Primary Image</label>
//                 </div>
//                 {formData.images.length > 1 && (
//                   <button
//                     onClick={() => removeImage(index)}
//                     className="mt-2 text-red-500 hover:text-red-700"
//                     aria-label={`Remove image ${index + 1}`}
//                   >
//                     Remove Image
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               onClick={addImage}
//               className="mt-4 text-blue-600 hover:text-blue-800"
//               aria-label="Add new image"
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
//               aria-label="Previous step"
//             >
//               Previous
//             </button>
//           )}
//           <button
//             onClick={nextStep}
//             className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ml-auto"
//             aria-label={step === 3 ? "Submit product" : "Next step"}
//           >
//             {step === 3 ? "Submit" : "Next"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
