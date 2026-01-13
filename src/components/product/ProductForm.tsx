import React, { useState } from "react";
import {
  useCreateNewCategoryMutation,
  useCreateNewProductMutation,
  useGetCategoryQuery,
} from "@/redux/query/productApi";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  Settings2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  categoryId: string | null;
  newCategoryName: string;
  variants: Variant[];
  images: Image[];
}

// interface Category {
//   id: string;
//   categoryName: string;
// }

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [createNewProduct, { isLoading: isCreatingProduct }] =
    useCreateNewProductMutation();
  const [createNewCategory, { isLoading: isCreatingCategory }] =
    useCreateNewCategoryMutation();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoryQuery();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: null,
    newCategoryName: "",
    variants: [
      {
        sku: "",
        price: "",
        stock: 0,
        variantOptions: [{ attributeName: "Color", attributeValue: "" }],
      },
    ],
    images: [
      {
        url: "",
        altText: "",
        isPrimary: true,
      },
    ],
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
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
    vIdx: number,
    oIdx: number,
    field: keyof VariantOption,
    value: string
  ) => {
    const newVariants = [...formData.variants];
    const newOptions = [...newVariants[vIdx].variantOptions];
    newOptions[oIdx] = { ...newOptions[oIdx], [field]: value };
    newVariants[vIdx].variantOptions = newOptions;
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

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          sku: "",
          price: "",
          stock: 0,
          variantOptions: [{ attributeName: "", attributeValue: "" }],
        },
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
    if (!newImages.some((img) => img.isPrimary) && newImages.length > 0)
      newImages[0].isPrimary = true;
    setFormData({ ...formData, images: newImages });
  };

  const validateForm = () => {
    if (!formData.title) return "Title is required";
    if (!formData.description) return "Description is required";
    if (!formData.categoryId && !formData.newCategoryName)
      return "Select or create a category";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      let categoryId = formData.categoryId;
      if (!categoryId && formData.newCategoryName) {
        const catRes = await createNewCategory({
          name: formData.newCategoryName,
        }).unwrap();
        categoryId = catRes.id;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId,
        variants: formData.variants.map((v) => ({
          ...v,
          options: v.variantOptions,
        })),
        images: formData.images,
      };

      console.log(payload, "payload category");

      await createNewProduct(payload).unwrap();
      toast.success("Product created successfully!");
      navigate("/dashboard/products");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  const steps = [
    { id: 1, label: "Description", icon: <Package className="w-4 h-4" /> },
    { id: 2, label: "Variants", icon: <Settings2 className="w-4 h-4" /> },
    { id: 3, label: "Media", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  if (isCategoriesLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black italic uppercase tracking-widest text-[10px]">
              <Plus className="w-3 h-3" /> New Listing
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter">
              Create <span className="text-primary text-6xl">Product.</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Detailed specifications for your global catalog item.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 bg-secondary/20 p-1.5 rounded-2xl border border-border/50">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  step === s.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <Card className="rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black italic">
                    General Info
                  </CardTitle>
                  <CardDescription>
                    The core identity of your product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Product Title</Label>
                    <Input
                      placeholder="e.g. Signature Cotton Tee"
                      className="h-14 rounded-2xl bg-secondary/20 border-border/50 text-lg"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Description</Label>
                    <Textarea
                      placeholder="Narrate your product's story..."
                      className="min-h-[200px] rounded-2xl bg-secondary/20 border-border/50 p-6 text-base resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Category
                      </Label>
                      <Select
                        value={formData.categoryId || "none"}
                        onValueChange={(val) =>
                          handleChange(
                            "categoryId",
                            val === "none" ? null : val
                          )
                        }
                      >
                        <SelectTrigger className="h-14 rounded-2xl bg-secondary/20 border-border/50">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50">
                          <SelectItem value="none">
                            None / New Category
                          </SelectItem>
                          {categories.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!formData.categoryId && (
                      <div className="space-y-2 animate-in zoom-in duration-300">
                        <Label className="font-bold ml-1">
                          New Category Name
                        </Label>
                        <Input
                          placeholder="Create New..."
                          className="h-14 rounded-2xl bg-primary/5 border-primary/20"
                          value={formData.newCategoryName}
                          onChange={(e) =>
                            handleChange("newCategoryName", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {formData.variants.map((v, i) => (
                  <Card
                    key={i}
                    className="rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-xl relative group"
                  >
                    {formData.variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(i)}
                        className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <CardHeader className="p-8">
                      <CardTitle className="text-xl font-black italic flex items-center gap-3">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-xs not-italic">
                          {i + 1}
                        </span>
                        Variant Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest opacity-60">
                            SKU
                          </Label>
                          <Input
                            placeholder="SKU-001"
                            value={v.sku}
                            onChange={(e) =>
                              handleVariantChange(i, "sku", e.target.value)
                            }
                            className="rounded-xl bg-secondary/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest opacity-60">
                            Price ($)
                          </Label>
                          <Input
                            placeholder="0.00"
                            value={v.price}
                            onChange={(e) =>
                              handleVariantChange(i, "price", e.target.value)
                            }
                            className="rounded-xl bg-secondary/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest opacity-60">
                            Inventory
                          </Label>
                          <Input
                            type="number"
                            value={v.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                i,
                                "stock",
                                parseInt(e.target.value)
                              )
                            }
                            className="rounded-xl bg-secondary/10"
                          />
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-secondary/5 border border-border/30 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Attributes
                          </Label>
                          <Button
                            onClick={() => addVariantOption(i)}
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase text-primary"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Attribute
                          </Button>
                        </div>
                        {v.variantOptions.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex gap-4 items-center animate-in slide-in-from-left-2"
                          >
                            <Input
                              placeholder="Name (e.g. Size)"
                              value={opt.attributeName}
                              onChange={(e) =>
                                handleVariantOptionChange(
                                  i,
                                  oIdx,
                                  "attributeName",
                                  e.target.value
                                )
                              }
                              className="h-10 rounded-xl bg-background"
                            />
                            <Input
                              placeholder="Value (e.g. XL)"
                              value={opt.attributeValue}
                              onChange={(e) =>
                                handleVariantOptionChange(
                                  i,
                                  oIdx,
                                  "attributeValue",
                                  e.target.value
                                )
                              }
                              className="h-10 rounded-xl bg-background"
                            />
                            <button
                              onClick={() => removeVariantOption(i, oIdx)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={addVariant}
                  variant="outline"
                  className="w-full h-16 rounded-[2rem] border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest italic text-xs gap-3"
                >
                  <Plus className="w-5 h-5" /> Add Another Product Variant
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {formData.images.map((img, i) => (
                  <Card
                    key={i}
                    className="rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-xl relative group overflow-hidden"
                  >
                    <CardContent className="p-8 flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-40 h-40 bg-secondary/20 rounded-2xl overflow-hidden shrink-0 border border-border/50 relative">
                        {img.url ? (
                          <img
                            src={img.url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-10 h-10 opacity-20" />
                          </div>
                        )}
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                            Primary
                          </div>
                        )}
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest opacity-60 text-muted-foreground">
                            Source URL
                          </Label>
                          <Input
                            placeholder="https://..."
                            value={img.url}
                            onChange={(e) =>
                              handleImageChange(i, "url", e.target.value)
                            }
                            className="h-12 rounded-xl bg-secondary/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest opacity-60 text-muted-foreground">
                            Alt Text
                          </Label>
                          <Input
                            placeholder="Descriptive label..."
                            value={img.altText}
                            onChange={(e) =>
                              handleImageChange(i, "altText", e.target.value)
                            }
                            className="h-12 rounded-xl bg-secondary/10"
                          />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`primary-${i}`}
                              checked={img.isPrimary}
                              onCheckedChange={(val) =>
                                handleImageChange(i, "isPrimary", !!val)
                              }
                            />
                            <label
                              htmlFor={`primary-${i}`}
                              className="text-sm font-bold leading-none cursor-pointer"
                            >
                              Set as Primary Media
                            </label>
                          </div>
                          {formData.images.length > 1 && (
                            <Button
                              onClick={() => removeImage(i)}
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-destructive hover:bg-destructive/10 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={addImage}
                  variant="outline"
                  className="w-full h-16 rounded-[2rem] border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest italic text-xs gap-3"
                >
                  <Plus className="w-5 h-5" /> Add More Media Assets
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center pt-8 border-t border-border/50">
              <Button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                variant="ghost"
                className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-3"
              >
                <ChevronLeft className="w-4 h-4" /> Go Back
              </Button>

              <Button
                onClick={
                  step === 3
                    ? handleSubmit
                    : () => setStep((s) => Math.min(3, s + 1))
                }
                disabled={isCreatingProduct || isCreatingCategory}
                className="rounded-2xl h-14 px-10 font-black italic text-lg gap-3 shadow-2xl shadow-primary/20"
              >
                {isCreatingProduct || isCreatingCategory ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : step === 3 ? (
                  <>
                    Establish Product <CheckCircle2 className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue Configuration <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar / Preview */}
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 h-fit sticky top-28 overflow-hidden border">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black italic">
                  Platform Summary
                </CardTitle>
                <CardDescription>How your listing will appear.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Preview Title
                  </p>
                  <h3 className="text-2xl font-black italic truncate">
                    {formData.title || "Untiled Listing"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-background/50 border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Variants
                    </p>
                    <p className="text-xl font-black italic">
                      {formData.variants.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Total Stock
                    </p>
                    <p className="text-xl font-black italic">
                      {formData.variants.reduce(
                        (acc, v) => acc + (v.stock || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <div className="flex justify-between items-center text-sm font-black italic">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                      Merchant Visibility
                    </span>
                    <span className="text-green-500">Global Ready</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 bg-primary/10 border-t border-primary/20 px-8 py-5">
                <p className="text-[10px] font-bold text-primary/80 leading-relaxed uppercase tracking-widest">
                  By establishing this product, it will be immediately available
                  in the global OASIS ecosystem.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="font-bold italic animate-pulse">
        Synchronizing product data...
      </p>
    </div>
  </div>
);

export default ProductForm;
