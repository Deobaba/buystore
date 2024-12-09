"use client"
import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Star, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Product } from "@/lib/product"

interface Props {
  id: string;
}

const ProductPage =({id}:Props) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`); // Adjust to match your API route
        if (!res.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-20 text-red-500">Error: {error || "Product not found"}</div>;
  }

  // const product = {
  //   name: "Wireless Noise-Cancelling Headphones",
  //   description: "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise-cancelling technology, these headphones provide an immersive listening experience whether you're commuting, working, or relaxing at home.",
  //   price: "$199.99",
  //   rating: 4.5,
  //   reviews: 128,
  //   seller: "AudioTech",
  //   sellerUrl: "https://example.com/seller",
  //   images: [
  //     "https://res.cloudinary.com/dlbwktrdc/image/upload/v1718971907/rdma8kzugnfje6zrk4gc.jpg",
  //     "https://res.cloudinary.com/dlbwktrdc/image/upload/v1699371470/cld-sample.jpg",
  //     "https://res.cloudinary.com/dlbwktrdc/image/upload/v1699371469/samples/woman-on-a-football-field.jpg",
  //     "https://res.cloudinary.com/dlbwktrdc/image/upload/v1699371469/samples/dessert-on-a-plate.jpg",
  //   ],
  //   features: [
  //     "Active noise cancellation",
  //     "30-hour battery life",
  //     "Comfortable over-ear design",
  //     "Bluetooth 5.0 connectivity",
  //     "Built-in microphone for calls",
  //   ],
  // }
const  features= [
      "Active noise cancellation",
      "30-hour battery life",
      "Comfortable over-ear design",
      "Bluetooth 5.0 connectivity",
      "Built-in microphone for calls",
    ]

  const relatedProducts = [
    {
      name: "Portable Bluetooth Speaker",
      price: "$79.99",
      image: "https://res.cloudinary.com/dlbwktrdc/image/upload/v1730237762/car-brainaic/carbrainiac__car-brainaic_1730237761369.jpg",
    },
    {
      name: "True Wireless Earbuds",
      price: "$129.99",
      image: "https://res.cloudinary.com/dlbwktrdc/image/upload/v1718971907/rdma8kzugnfje6zrk4gc.jpg",
    },
    {
      name: "Audio-Technica Turntable",
      price: "$249.99",
      image: "https://res.cloudinary.com/dlbwktrdc/image/upload/v1717162613/v3mctf5vvlwf1vnvwdwe.webp",
    },
    {
      name: "Soundbar with Subwoofer",
      price: "$199.99",
      image: "https://res.cloudinary.com/dlbwktrdc/image/upload/v1699371470/cld-sample.jpg",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Carousel className="w-full max-w-xs mx-auto mb-4">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className="w-full h-auto rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex justify-center space-x-2 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-purple-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-xl font-bold mb-4">{product.price}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <Button size="lg" className="w-full mb-4">
              View on {product.seller}'s Site
            </Button>
            <Button variant="outline" size="lg" className="w-full mb-6">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Key Features:</h2>
              <ul className="list-disc list-inside">
                {features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Seller: <a href={product.sellerUrl} className="text-purple-600 hover:underline">{product.seller}</a>
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="font-bold text-lg mt-2">{product.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm text-gray-600">
                Buy Value Store is your go-to destination for finding the best deals on a wide range of products from trusted sellers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-600 hover:text-purple-600">Home</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-purple-600">Categories</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-purple-600">Featured Products</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-purple-600">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="text-sm text-gray-600">Email: info@buyvaluestore.com</p>
              <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">&copy; 2023 Buy Value Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductPage