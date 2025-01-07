"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  id: string;
}

const EditProduct = ({ id }: Props) => {
  const [productName, setProductName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sellerInfo, setSellerInfo] = React.useState("");
  const [externalLink, setExternalLink] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]); // Array to store image URLs
  const [loading, setLoading] = React.useState(true);

  // Fetch product by ID and populate fields
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const product = await response.json();

        setProductName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setSellerInfo(product.sellerInfo);
        setExternalLink(product.externalLink);
        setImages(product.images || []); // Directly set the image URLs from the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileReaders: Promise<string>[] = Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string); // Get data URL
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(fileReaders)
      .then((uploadedFiles) => {
        setImages((prevImages) => [...prevImages, ...uploadedFiles]);
      })
      .catch((error) => console.error("Error uploading files:", error));
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      productName === "" ||
      description === "" ||
      price === "" ||
      category === "" ||
      sellerInfo === "" ||
      externalLink === ""
    ) {
      toast.error("All fields are compulsory");
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName, // Ensure the backend expects the name field
          description,
          price,
          category,
          sellerInfo,
          externalLink,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      toast.success("Product updated successfully");

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#350962]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </header>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellerInfo">Seller Information</Label>
                <Input
                  id="sellerInfo"
                  value={sellerInfo}
                  onChange={(e) => setSellerInfo(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="externalLink">External Link</Label>
                <Input
                  id="externalLink"
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">Product Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://via.placeholder.com/150")
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[#350962] text-white mt-5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="loader"></span>
                  <span>Updating product...</span>
                </div>
              ) : (
                "Edit Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
