import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import bannerOne from "../../assets/banner-1.jpg";
import bannerTwo from "../../assets/banner-2.jpg";
import bannerThree from "../../assets/banner-3.jpg";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { toast } from "react-toastify";
import { getFeatureImages } from "@/store/common-slice";

const categories = [
    { id: "dryerballs", label: "Dryer Balls" },
    { id: "feltballs", label: "Felt Balls" },
    { id: "craftsupplies", label: "Craft Supplies" },
    { id: "feltshoes", label: "Felt Shoes" },
    { id: "petproduction", label: "Pet Production" },
    { id: "decors", label: "Decors" },
    { id: "rugs", label: "Rugs" },
    { id: "yarns", label: "Yarns" },
    { id: "fashion", label: "Fashion" },
    { id: "yogamats", label: "Yoga Mats" },
    { id: "colorchart", label: "Color Chart" },
];

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productList, productDetails } = useSelector((state) => state.shopProducts);
    const { featureImageList = [] } = useSelector((state) => state.commonFeature || {});
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle navigation to category listing page
    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section]: [getCurrentItem.id],
        };
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate("/shop/listing");
    }

    // Get product details
    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    // Add product to cart
    function handleAddtoCart(getCurrentProductId) {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success("Product added to cart"); // Success toast
            }
        });
    }

    // Set up interval for carousel
    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [featureImageList]);

    // Fetch filtered products
    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    }, [dispatch]);

    // Fetch feature images
    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[400px] overflow-hidden">
                {featureImageList && featureImageList.length > 0 ? featureImageList.map((slide, index) => (
                    <img
                        src={slide?.image}
                        alt={`Slide ${index + 1}`}
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    />
                )) : null}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)
                    }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
                    }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((categoryItem) => (
                            <Card
                                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                                key={categoryItem.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productList && productList.length > 0 ? (
                            productList.map((productItem) => (
                                <ShoppingProductTile
                                    handleGetProductDetails={handleGetProductDetails}
                                    product={productItem}
                                    handleAddtoCart={handleAddtoCart}
                                    key={productItem.id}
                                />
                            ))
                        ) : (
                            <p className="text-center">No products available.</p>
                        )}
                    </div>
                </div>
            </section>
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default ShoppingHome;
