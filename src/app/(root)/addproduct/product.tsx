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
import { ChevronLeft, Star, Share2 } from "lucide-react";

const AddProduct = () => {
  const [productName, setProductName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sellerInfo, setSellerInfo] = React.useState("");
  const [externalLink, setExternalLink] = React.useState("");
  const [images, setImages] = React.useState<any[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileReaders: Promise<{ name: string; data: string; type: string }>[] =
      Array.from(files).map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: file.name,
                data: reader.result as string,
                type: file.type,
              });
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
    console.log("button works");

    if (
      productName == "" ||
      description == "" ||
      price == "" ||
      category == "" ||
      sellerInfo == "" ||
      externalLink == ""
    ) {
      toast.error("All fields are compulsory");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          description,
          price,
          category,
          sellerInfo,
          externalLink,
          images,
        }),
      });

      console.log("it got here ...", response);

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      console.log("Product added successfully:", data);

      // Show success toast
      toast.success("Product added successfully");

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

      // Reset form fields
      setProductName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setSellerInfo("");
      setExternalLink("");
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the product");
    }
  };

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
          <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
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
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Home & Kitchen">
                      Home & Kitchen
                    </SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Sports & Outdoors">
                      Sports & Outdoors
                    </SelectItem>
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
                  type="url"
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
                        src={image.data}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
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
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-[#350962] text-[#ffffff]"
            type="submit"
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProduct;
