"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Smartphone,
  Home,
  Shirt,
  Sparkles,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { IProduct } from "@/lib/product";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [featuredProducts, setFeaturedProducts] = React.useState<IProduct[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
  });

  const [searchQuery, setSearchQuery] = React.useState("");

  const categories = [
    { name: "Electronics", icon: Smartphone },
    { name: "Home & Kitchen", icon: Home },
    { name: "Clothing", icon: Shirt },
    { name: "Beauty", icon: Sparkles },
    { name: "Sports & Outdoors", icon: Dumbbell },
  ];

  // React.useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("/api/products");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch products");
  //       }

  //       const data = await response.json();
  //       setFeaturedProducts(data.products);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        page: currentPage.toString(),
        limit: pagination.pageSize.toString(),
      });

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      // const data = await response.json(); // Fetch the entire response object
      // const product = data.product; // Extract the product data from the response
      const data = await response.json();
      setFeaturedProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage]);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/images/Logo2.svg"
              alt="SCAMalicious Logo"
              width={50}
              height={50}
              className="mr-3"
            />{" "}
            <span className="text-2xl font-bold text-[#350962]">
              Buy Value Store
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={fetchProducts} // Trigger fetch on button click
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white p-4">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full mb-4"
            />
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Link href={`/product/${product._id}`}>
                <Card key={index}>
                  <CardContent className="p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <CardTitle>{product.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      {product.description}
                    </p>
                    <p className="font-bold text-lg mt-2">{product.price}</p>
                    {/* <p className="text-sm text-gray-500 mt-1">
                      Seller: {product.sellerInfo}
                    </p> */}
                    <p className="text-sm text-gray-600 mt-2">
                      {product.description.length > 30
                        ? `${product.description.substring(0, 50)}...`
                        : product.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={
                        product.externalLink.startsWith("http")
                          ? product.externalLink
                          : `https://${product.externalLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      <Button className="w-[100px] bg-[#350962] text-[#ffffff]">
                        Buy
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col justify-end items-end">
          <h2 className="text-lg font-bold mb-4">Pagination</h2>
          <div className="flex justify-end">
            <div className="flex space-x-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* <section>
          <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                    <category.icon className="h-8 w-8 text-[#350962]" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-[#350962] transition-colors duration-300">
                    {category.name}
                  </CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}

        <section>
          <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {/* All Categories Card */}
            <Card
              onClick={() => handleCategoryClick(null)}
              className={`group hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                selectedCategory === null ? "border-2 border-purple-500" : ""
              }`}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                  <span className="h-8 w-8 text-[#350962]">All</span>
                </div>
                <CardTitle
                  className={`text-lg group-hover:text-[#350962] transition-colors duration-300 ${
                    selectedCategory === null ? "text-purple-500" : ""
                  }`}
                >
                  All
                </CardTitle>
              </CardContent>
            </Card>

            {/* Dynamic Category Cards */}
            {categories.map((category, index) => (
              <Card
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className={`group hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                  selectedCategory === category.name
                    ? "border-2 border-purple-500"
                    : ""
                }`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                    <category.icon className="h-8 w-8 text-[#350962]" />
                  </div>
                  <CardTitle
                    className={`text-lg group-hover:text-[#350962] transition-colors duration-300 ${
                      selectedCategory === category.name
                        ? "text-purple-500"
                        : ""
                    }`}
                  >
                    {category.name}
                  </CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm text-gray-600">
                Buy Value Store is your go-to destination for finding the best
                deals on a wide range of products from trusted sellers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Featured Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600">
                Email: info@buyvaluestore.com
              </p>
              <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2023 Buy Value Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
