"use client";
import * as React from "react";
import { useState } from "react";
import {
  BarChart,
  Users,
  Package,
  Search,
  Menu,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IProduct } from "@/lib/product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "@/components/ui/Modal";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [featuredProducts, setFeaturedProducts] = React.useState<IProduct[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 5,
  });

  const [totalPage, setTotalPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "$199.99",
      stock: 50,
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: "$249.99",
      stock: 30,
    },
    {
      id: 3,
      name: "Portable Speaker",
      category: "Electronics",
      price: "$79.99",
      stock: 100,
    },
    {
      id: 4,
      name: "Fitness Tracker",
      category: "Electronics",
      price: "$99.99",
      stock: 75,
    },
    {
      id: 5,
      name: "Bluetooth Earbuds",
      category: "Electronics",
      price: "$129.99",
      stock: 60,
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        page: currentPage.toString(),
        limit: pagination.pageSize.toString(),
      });

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setFeaturedProducts(data.products);
      setPagination(data.pagination);
      setTotalPage(data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Delete item from the table

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowModal(true); // Open modal
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      // Remove the deleted product from the state
      setFeaturedProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      console.log("Product deleted successfully");

      toast.success("Product deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
      toast.error(error.message || "Error deleting product.");
    } finally {
      setShowModal(false); // Close modal
      setProductToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}

      <aside
        className={`bg-white w-64 min-h-screen flex flex-col ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="p-4 border-b">
          <Image
            src="/assets/images/Logo3.jpg"
            alt="SCAMalicious Logo"
            width={70}
            height={70}
            className="mb-5 items-center ml-20 mt-5"
          />
          <h2 className="text-lg text-center font-semibold text-[#E89217]">
            Admin Dashboard
          </h2>
        </div>
        <nav className="flex-grow">
          <ul className="p-2 mt-10">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </li>
            <li>
              <Link href="/change-password">
                <Button variant="ghost" className="w-full justify-start mt-2">
                  <Users className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </Link>
            </li>
            {/* <li>
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </li> */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              {/* <Input type="search" placeholder="Search..." className="w-64" /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <img
                      className="rounded-full"
                      src="/placeholder.svg?height=32&width=32"
                      alt="Admin avatar"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-xl font-medium">Dashboard</h3>

            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Products
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl ml-7 font-bold">{totalPage}</div>
                      <p className="text-xs text-muted-foreground">
                        +15% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 sm:mt-0">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Affiliates
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full px-6 xl:w-1/3 mt-4 xl:mt-0">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Click-through Rate
                      </CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.24%</div>
                      <p className="text-xs text-muted-foreground">
                        +1.2% from last week
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage your product catalog</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    {/* <Input
                      placeholder="Search products..."
                      className="max-w-sm"
                    /> */}
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
                    <Link href="/addproduct">
                      <Button className="text-[#ffffff] bg-[#350962]">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                      </Button>
                    </Link>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featuredProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>
                            <Link href={`/dashboard/${product._id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-center items-center mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

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
                    <Button
                      variant="ghost"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <span className="mx-2">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default AdminDashboard;
