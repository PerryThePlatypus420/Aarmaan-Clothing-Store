import React from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../cartContext";
import { useContext } from "react";
import { FaCartPlus } from "react-icons/fa";
import { LuPlus, LuMinus } from "react-icons/lu";
import { WishlistContext } from "../wishlistContext";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { ThreeDots } from "react-loader-spinner";
import "./ProductDetails.css";

const API_URL = process.env.REACT_APP_API_URL;

function Product() {
  const { addItemToCart } = useContext(CartContext);
  const { toggleItemInWishlist, isInWishlist } = useContext(WishlistContext);
  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${API_URL}/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const [items, setItems] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Get the current selected size's stock
  const getSelectedSizeStock = () => {
    if (!selectedSize || !product.sizes) return 0;
    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    return sizeObj ? sizeObj.stock : 0;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ThreeDots visible={true} height="80" width="80" color="black" radius="9" />
      </div>
    );
  }

  // Reset quantity to 1 when size changes
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    setItems(1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItemInWishlist(id);
  };

  const handleSlideChange = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % product.images.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Get the maximum allowed quantity based on product type and selection
  const getMaxQuantity = () => {
    if (product.sizes && product.sizes.length > 0) {
      return selectedSize ? getSelectedSizeStock() : 0;
    } else {
      return product.stock || 0;
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Product Image Section */}
        <div className="col-12 col-md-6">
          <div className="position-relative bg-white rounded-3 overflow-hidden shadow-sm">
            {product.images instanceof Array && product.images.length > 0 ? (
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="false">
                <div className="carousel-inner">
                  {product.images.map((image, index) => (
                    <div className={`carousel-item ${index === currentSlide ? "active" : ""}`} key={index}>
                      <img 
                        src={image} 
                        className="d-block w-100" 
                        alt={`${product.title} - View ${index + 1}`}
                        style={{ 
                          height: "500px", 
                          objectFit: "cover",
                          backgroundColor: "#ffffff"
                        }} 
                      />
                    </div>
                  ))}
                </div>
                {product.images.length > 1 && (
                  <>
                    <button 
                      className="carousel-control-prev" 
                      type="button"
                      onClick={() => handleSlideChange('prev')}
                      style={{ width: "8%" }}
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button 
                      className="carousel-control-next" 
                      type="button"
                      onClick={() => handleSlideChange('next')}
                      style={{ width: "8%" }}
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <img 
                src={product.images?.[0]} 
                alt={product.title || "Product"} 
                className="img-fluid w-100"
                style={{ 
                  height: "500px", 
                  objectFit: "cover",
                  backgroundColor: "#ffffff"
                }} 
              />
            )}
            
            {/* Image Counter - Small badge */}
            {product.images instanceof Array && product.images.length > 1 && (
              <div className="position-absolute bottom-0 end-0 m-3">
                <span className="badge bg-dark bg-opacity-75 px-2 py-1 rounded-pill small">
                  {currentSlide + 1} / {product.images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="col-12 col-md-6">
          <div className="h-100 d-flex flex-column">
            {/* Product Title and Wishlist */}
            <div className="d-flex align-items-start justify-content-between mb-3">
              <h1 className="h4 fw-semibold text-dark mb-0 me-3" style={{ lineHeight: "1.3" }}>
                {product.title}
              </h1>
              <div className="heart-cont-prod-details" onClick={handleWishlist} style={{ cursor: "pointer", fontSize: "1.4rem" }}>
                {isInWishlist(id) ? (
                  <IoHeart className="text-danger" style={{ filter: "drop-shadow(0 0 3px rgba(220, 53, 69, 0.3))" }} />
                ) : (
                  <IoHeartOutline className="text-muted" style={{ transition: "color 0.2s ease" }} />
                )}
              </div>
            </div>

            {/* Product Price */}
            <div className="mb-4">
              <span className="h5 text-success fw-bold">Rs. {product.price?.toLocaleString()}</span>
            </div>

            {/* Size Selection and Stock Info */}
            {product.sizes && product.sizes.length > 0 ? (
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-dark">Available Sizes</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {product.sizes.map((sizeItem, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-2 p-2 text-center position-relative ${
                        selectedSize === sizeItem.size 
                          ? 'border-primary bg-primary text-white shadow-sm' 
                          : sizeItem.stock === 0 
                            ? 'border-danger bg-light text-muted' 
                            : 'border-secondary bg-white text-dark shadow-sm'
                      }`}
                      style={{ 
                        minWidth: "60px", 
                        cursor: sizeItem.stock > 0 ? "pointer" : "not-allowed",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => sizeItem.stock > 0 && handleSizeChange({ target: { value: sizeItem.size } })}
                    >
                      <div className="fw-bold small">{sizeItem.size}</div>
                      <div className="small mt-1" style={{ fontSize: "0.75rem" }}>
                        {sizeItem.stock > 0 ? `${sizeItem.stock} left` : 'Out'}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedSize && (
                  <div className="alert alert-light border-primary py-2 small">
                    Selected: <strong>{selectedSize}</strong> - {getSelectedSizeStock()} items available
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <div className={`alert ${product.stock > 0 ? 'alert-success' : 'alert-danger'} border-0 py-2 rounded-3`}>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {product.stock > 0 ? (
                        <i className="bi bi-check-circle-fill"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill"></i>
                      )}
                    </div>
                    <div className="small">
                      <strong>Stock:</strong> {product.stock > 0 ? 
                        `${product.stock} items available` : 
                        'Currently out of stock'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mb-4">
              <div className="row g-2 align-items-end">
                <div className="col-6 col-sm-4">
                  <label className="form-label fw-bold text-dark mb-2 small">Quantity</label>
                  <div className="product-quantity-control">
                    <button 
                      className="quantity-button" 
                      onClick={() => setItems((prev) => Math.max(1, prev - 1))}
                      disabled={items <= 1 || (!selectedSize && product.sizes && product.sizes.length > 0) || getMaxQuantity() <= 0}
                    > 
                      <LuMinus />  
                    </button>
                    <span className="quantity-count">{items}</span>
                    <button 
                      className="quantity-button" 
                      onClick={() => setItems((prev) => Math.min(getMaxQuantity(), prev + 1))}
                      disabled={items >= getMaxQuantity() || (!selectedSize && product.sizes && product.sizes.length > 0) || getMaxQuantity() <= 0}
                      style={{
                        opacity: items >= getMaxQuantity() ? 0.5 : 1,
                        cursor: items >= getMaxQuantity() ? 'not-allowed' : 'pointer'
                      }}
                    > 
                      <LuPlus /> 
                    </button>
                  </div>
                  
                </div>
                <div className="col-6 col-sm-8">
                  <button 
                    className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-2 rounded-2"
                    style={{ 
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      padding: "0.5rem 1rem"
                    }}
                    onClick={() => {
                      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                        alert("Please select a size");
                        return;
                      }
                      if (getMaxQuantity() <= 0) {
                        alert("This item is out of stock");
                        return;
                      }
                      addItemToCart(id, items, selectedSize, getMaxQuantity());
                    }}
                    disabled={(product.sizes && product.sizes.length > 0 && !selectedSize) || 
                              getMaxQuantity() <= 0}
                  >
                    <FaCartPlus /> <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mb-4 p-3 bg-light rounded-3">
                <h6 className="fw-bold mb-2 text-dark">Description</h6>
                <p className="text-muted lh-base mb-0" style={{ fontSize: "0.9rem" }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Design Details */}
            {product.design_details && (
              <div className="mb-4 p-3 bg-light rounded-3">
                <h6 className="fw-bold mb-2 text-dark">Design Details</h6>
                <p className="text-muted lh-base mb-0" style={{ fontSize: "0.9rem" }}>
                  {product.design_details}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
