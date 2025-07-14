import React, { useState, useEffect } from "react";
import "./ProductsComp.css"; // We'll add this CSS file for validation styling
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

const ProductsComp = ({ onBack }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [homepageProducts, setHomepageProducts] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [imageFields, setImageFields] = useState([]);
    const [originalImageIndexes, setOriginalImageIndexes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // ✅ Fetch categories, products, and homepage products
    useEffect(() => {
        // Get the authentication token
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Fetch homepage products - get just the IDs
        fetch(`${API_URL}/api/homepage-products/ids`, { headers })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch homepage products');
                return res.json();
            })
            .then(data => {
                console.log('Homepage product IDs:', data);
                setHomepageProducts(data);
            })
            .catch(err => console.error('Error fetching homepage products:', err));
            
        fetch(`${API_URL}/api/categories`, { headers })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch categories');
                return res.json();
            })
            .then(data => setCategories(data.map(cat => cat.category)))
            .catch(err => console.error(err));

        fetch(`${API_URL}/api/products`, { headers })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch products');
                return res.json();
            })
            .then(data => setProducts(data.map(p => ({ ...p, id: p._id.toString() }))))
            .catch(err => console.error(err));

    }, []);

    // ✅ Open Modal for Add or Edit
    const openModal = (product = null) => {
        if (product) {
            // Create array of indexes for existing images
            const indexes = product.images.map((_, index) => index);
            setOriginalImageIndexes(indexes);

            const existingImageFields = product.images?.map((img, index) => ({
                id: index,
                url: img,
                file: null,
                isOriginal: true,  // Add this flag to identify original images
                originalIndex: index  // Add this to track original position
            })) || [];

            // Debug: Check if product is in homepage
            const isOnHomepage = homepageProducts.includes(product.id);
            console.log('Product ID:', product.id, 'Homepage Products:', homepageProducts, 'Is on homepage:', isOnHomepage);
            
            setCurrentProduct({
                ...product,
                homepage: isOnHomepage,
                images: existingImageFields.map(field => field.url),
                stock: product.stock || 0 // Add stock field, default to 0 if not present
            });

            setImageFields(existingImageFields);
            setIsEditable(false);
        } else {
            setOriginalImageIndexes([]);
            setCurrentProduct({
                category: categories[0] || '',
                title: '',
                price: '',
                images: [],
                description: '',
                design_details: '',
                sizes: [],
                stock: 0, // Add default stock field for new products
                homepage: false
            });

            setImageFields([{ id: 0, url: '', file: null, isOriginal: false }]);
            setIsEditable(true);
        }
        setShowModal(true);
    };

    // ✅ Handle Image Upload for Each Field
    const handleImageUpload = (index, file) => {
        const updatedFields = [...imageFields];
        updatedFields[index] = {
            ...updatedFields[index],
            url: URL.createObjectURL(file),
            file: file,
        };
        setImageFields(updatedFields);
    };

    // ✅ Add Another Image Field
    const addImageField = () => {
        const newField = { id: Date.now(), url: '', file: null };
        setImageFields([...imageFields, newField]);
    };

    // ✅ Remove Image Field
    const removeImageField = (id) => {
        const updatedFields = imageFields.filter(field => field.id !== id);
        setImageFields(updatedFields);
    };

    // In ProductsComp.js - Update the handleSaveProduct function
    const handleSaveProduct = () => {
        const isEditing = !!currentProduct.id;
        const url = isEditing
            ? `${API_URL}/api/products/edit/${currentProduct.id}`
            : `${API_URL}/api/products/add`;
        const method = isEditing ? 'PUT' : 'POST';

        // Set saving state to show loading indicator
        setIsSaving(true);

        // Reset validation errors
        setValidationErrors({});
        
        // Initialize errors object
        const errors = {};

        // Validate required fields
        if (!currentProduct.title) errors.title = "Please fill out this field";
        if (!currentProduct.price) errors.price = "Please fill out this field";
        if (!currentProduct.category) errors.category = "Please select a category";
        if (!currentProduct.description) errors.description = "Please fill out this field";
        if (!currentProduct.design_details) errors.design_details = "Please fill out this field";
        
        // Validate at least one image
        if (imageFields.length === 0 || imageFields.every(field => !field.file && !field.isOriginal)) {
            errors.images = "Please add at least one image";
        }
        
        // Check if sizes have valid data (if any are present)
        const invalidSizeIndexes = [];
        currentProduct.sizes.forEach((size, index) => {
            if (!size.size || size.stock === undefined || size.stock === null) {
                invalidSizeIndexes.push(index);
            }
        });
        
        if (currentProduct.sizes.length > 0 && invalidSizeIndexes.length > 0) {
            errors.sizes = invalidSizeIndexes;
        }
        
        // If no sizes are provided, then stock field is required
        if (currentProduct.sizes.length === 0 && (currentProduct.stock === undefined || currentProduct.stock === null || currentProduct.stock === '')) {
            errors.stock = "Please enter a stock value";
        }
        
        // If there are validation errors, display them and stop
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const formData = new FormData();
        formData.append("category", currentProduct.category);
        formData.append("title", currentProduct.title);
        formData.append("price", currentProduct.price);
        formData.append("description", currentProduct.description);
        formData.append("design_details", currentProduct.design_details);
        formData.append("sizes", JSON.stringify(currentProduct.sizes));
        formData.append("homepage", currentProduct.homepage ? true : false);
        
        // If no sizes are provided, include the stock field
        if (currentProduct.sizes.length === 0) {
            formData.append("stock", currentProduct.stock);
        }

        if (isEditing) {
            // Get indexes of kept original images
            const keptOriginalIndexes = imageFields
                .filter(field => field.isOriginal)
                .map(field => field.originalIndex);

            // Append the kept image indexes
            formData.append("keptImageIndexes", JSON.stringify(keptOriginalIndexes));
        }

        // Only append files that are newly added
        imageFields.forEach(field => {
            if (field.file) {
                formData.append("images", field.file);
            }
        });

        // Get the authentication token
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return;
        }
        
        console.log('Saving product with data:', {
            method,
            url,
            title: currentProduct.title,
            category: currentProduct.category,
            price: currentProduct.price,
            images: imageFields.length,
            sizes: currentProduct.sizes,
            homepage: currentProduct.homepage
        });
        
        setIsSaving(true); // Start loading state
        
        fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        })
            .then(res => {
                if (!res.ok) {
                    console.error('Error response from server:', res.status, res.statusText);
                    return res.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            throw new Error(`Server error: ${text}`);
                        }
                    });
                }
                return res.json();
            })
            .then(data => {
                if (!data.product || !data.product._id) {
                    console.error("Failed to save the product.");
                    return;
                }

                // Update the UI with the product data directly from the response
                const updatedProduct = {
                    ...data.product,
                    id: data.product._id
                };

                if (isEditing) {
                    setProducts(products.map(p =>
                        p.id === data.product._id ? updatedProduct : p
                    ));
                } else {
                    setProducts([...products, updatedProduct]);
                }

                // Handle homepage update
                if (currentProduct.homepage) {
                    // Add to homepage
                    // Get the authentication token
                    const token = localStorage.getItem('token');
                    fetch(`${API_URL}/api/homepage-products/add`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ productID: data.product._id })
                    })
                        .then(res => {
                            // Handle both success and 400 (already exists) as valid scenarios
                            if (res.ok || res.status === 400) {
                                // Update our local state regardless of server response
                                // since we want the product to appear in homepage either way
                                setHomepageProducts(prev => {
                                    if (!prev.includes(data.product._id)) {
                                        return [...prev, data.product._id];
                                    }
                                    return prev;
                                });
                                return; // No need to parse JSON or handle error
                            }
                            // For other errors, throw to be caught by catch block
                            return res.json().then(data => {
                                throw new Error(data.message || "Error adding to homepage");
                            });
                        })
                        .catch(err => console.error("Error adding to homepage:", err));
                } else {
                    // Remove from homepage
                    // Get the authentication token
                    const token = localStorage.getItem('token');
                    fetch(`${API_URL}/api/homepage-products/delete/${data.product._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(() => {
                            setHomepageProducts(prev => prev.filter(id => id !== data.product._id));
                        })
                        .catch(err => console.error("Error removing from homepage:", err));
                }

                setShowModal(false);
                toast.success(isEditing ? "Product updated successfully!" : "Product added successfully!");
            })
            .catch(err => {
                console.error("Error saving product:", err);
                toast.error("Failed to save product. Please try again.");
            })
            .finally(() => {
                setIsSaving(false); // Reset saving state regardless of outcome
            });
    };

    // ✅ Handle Product Deletion with Confirmation Modal
    const confirmDelete = () => {
        // Get the authentication token
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/products/delete/${currentProduct.id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                setProducts(products.filter(product => product.id !== currentProduct.id));
                setShowDeleteConfirm(false);
                setShowModal(false);
                toast.success('Product deleted successfully!');
            })
            .catch(err => console.error(err));
    };

    const toggleHomepage = () => {
        setCurrentProduct({ ...currentProduct, homepage: !currentProduct.homepage });
    };

    const addSize = () => {
        setCurrentProduct({
            ...currentProduct,
            sizes: [...currentProduct.sizes, { size: '', stock: 0 }]
        });
    };

    const updateSize = (index, key, value) => {
        const updatedSizes = [...currentProduct.sizes];
        // If it's the stock field, ensure the value is not negative
        if (key === 'stock') {
            value = Math.max(0, parseInt(value) || 0);
        }
        updatedSizes[index][key] = value;
        setCurrentProduct({ ...currentProduct, sizes: updatedSizes });
    };

    const deleteSize = (index) => {
        const updatedSizes = currentProduct.sizes.filter((_, i) => i !== index);
        setCurrentProduct({ ...currentProduct, sizes: updatedSizes });
    };

    const filteredProducts = products.filter(product => {
        // Filter by category
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        
        // Filter by search query (title, category, or price)
        const searchMatch = searchQuery === '' || 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.price.toString().includes(searchQuery);
        
        return categoryMatch && searchMatch;
    });

    return (
        <div className="p-2">
            <div className="row mb-4 top-bar align-items-center">
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <button className="btn btn-secondary border w-100 w-md-auto" onClick={onBack}>
                        BACK TO DASHBOARD
                    </button>
                </div>
                <div className="col-12 col-md-4 mb-3 mb-md-0 text-center">
                    <h2 className="fw-normal mb-0">Product Management</h2>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end">
                    <div className="d-flex align-items-center">
                        <span className="me-2 fw-bold">Filter:</span>
                        <select
                            className="form-select border"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            style={{ minWidth: "120px" }}
                        >
                            <option value="All">All</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Search and Add Product Section - Stacked vertically and centered */}
            <div className="mb-4">
                {/* Search Section */}
                <div className="row justify-content-center mb-3">
                    <div className="col-12 col-md-6">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="flex-grow-1">
                                        <label className="form-label fw-bold mb-1">
                                            <i className="fas fa-search me-2"></i>Search Products
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title, category, or price..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    {searchQuery && (
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setSearchQuery("")}
                                            title="Clear search"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                                {searchQuery && (
                                    <small className="text-muted">
                                        Searching for: <span className="fw-bold">{searchQuery}</span>
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Add Product Button - Centered */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 text-center">
                        <button className="btn btn-success" onClick={() => openModal()}>
                            <i className="fas fa-plus me-2"></i>Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Count */}
            <div className="mb-3 text-center">
                <span className="text-muted">
                    Showing {filteredProducts.length} of {products.length} products
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedCategory !== 'All' && ` in category "${selectedCategory}"`}
                </span>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2 mb-5">
                {filteredProducts.map(product => (
                    <div key={product.id} className="col">
                        <div 
                            className="card border-0 h-100"
                            style={{ cursor: 'pointer', borderRadius: '15px' }}
                            onClick={() => openModal(product)}
                        >
                            {/* Homepage badge */}
                            {homepageProducts.includes(product.id) && (
                                <div
                                    className="position-absolute bg-success text-white px-2 py-1 rounded-pill"
                                    style={{
                                        top: '10px',
                                        right: '10px',
                                        zIndex: 1,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    ⭐ Featured
                                </div>
                            )}
                            <img
                                src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                className="card-img-top"
                                alt={product.title}
                                style={{ borderRadius: '15px 15px 0 0', height: '280px', objectFit: 'cover' }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">{product.title}</h5>
                                <p className="card-text">Category: {product.category}</p>
                                <p className="card-text text-success fw-bold">Rs. {product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Product Modal */}
            {showModal && currentProduct && (
                <div className="modal show d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {currentProduct.id ? 'Product Details' : 'Add New Product'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <h6 className="fw-bold">Category</h6>
                                <div className="field-container">
                                    <select
                                        className={`form-select ${validationErrors.category ? 'input-error' : ''}`}
                                        disabled={!isEditable || currentProduct.id}
                                        value={currentProduct.category}
                                        onChange={(e) => {
                                            setCurrentProduct({ ...currentProduct, category: e.target.value });
                                            if (validationErrors.category) {
                                                const newErrors = {...validationErrors};
                                                delete newErrors.category;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                    >
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {validationErrors.category && (
                                        <div className="error-tooltip">{validationErrors.category}</div>
                                    )}
                                </div>

                                <h6 className="fw-bold">Title</h6>
                                <div className="field-container">
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.title ? 'input-error' : ''}`}
                                        disabled={!isEditable}
                                        placeholder="Title"
                                        value={currentProduct.title}
                                        onChange={(e) => {
                                            setCurrentProduct({ ...currentProduct, title: e.target.value });
                                            if (validationErrors.title) {
                                                const newErrors = {...validationErrors};
                                                delete newErrors.title;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                    />
                                    {validationErrors.title && (
                                        <div className="error-tooltip">{validationErrors.title}</div>
                                    )}
                                </div>

                                <h6 className="fw-bold">Price</h6>
                                <div className="field-container">
                                    <input
                                        type="number"
                                        className={`form-control ${validationErrors.price ? 'input-error' : ''}`}
                                        disabled={!isEditable}
                                        placeholder="Price"
                                        value={currentProduct.price}
                                        onChange={(e) => {
                                            setCurrentProduct({ ...currentProduct, price: e.target.value });
                                            if (validationErrors.price) {
                                                const newErrors = {...validationErrors};
                                                delete newErrors.price;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                    />
                                    {validationErrors.price && (
                                        <div className="error-tooltip">{validationErrors.price}</div>
                                    )}
                                </div>

                                {/* Image Fields with Add Button */}
                                <h6 className="fw-bold">Images</h6>
                                <div className="field-container">
                                    {imageFields.map((field, index) => (
                                        <div key={field.id} className="d-flex align-items-center mb-2">
                                            <input
                                                type="file"
                                                className={`form-control ${validationErrors.images ? 'input-error' : ''}`}
                                                disabled={!isEditable}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    handleImageUpload(index, e.target.files[0]);
                                                    if (validationErrors.images) {
                                                        const newErrors = {...validationErrors};
                                                        delete newErrors.images;
                                                        setValidationErrors(newErrors);
                                                    }
                                                }}
                                            />
                                            {field.url && (
                                                <img
                                                    src={field.url}
                                                    alt={`Preview ${index}`}
                                                    style={{ width: "80px", height: "80px", objectFit: "cover", marginLeft: "10px" }}
                                                />
                                            )}
                                            {isEditable && (
                                                <button
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => removeImageField(field.id)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {validationErrors.images && (
                                        <div className="error-tooltip">{validationErrors.images}</div>
                                    )}
                                    {isEditable && (
                                        <button className="btn btn-outline-primary mb-3" onClick={addImageField}>
                                            Add Another Image
                                        </button>
                                    )}
                                </div>

                                <h6 className="fw-bold">Description</h6>
                                <div className="field-container">
                                    <textarea
                                        className={`form-control ${validationErrors.description ? 'input-error' : ''}`}
                                        disabled={!isEditable}
                                        placeholder="Description"
                                        value={currentProduct.description}
                                        onChange={(e) => {
                                            setCurrentProduct({ ...currentProduct, description: e.target.value });
                                            if (validationErrors.description) {
                                                const newErrors = {...validationErrors};
                                                delete newErrors.description;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                    ></textarea>
                                    {validationErrors.description && (
                                        <div className="error-tooltip">{validationErrors.description}</div>
                                    )}
                                </div>

                                <h6 className="fw-bold">Design Details</h6>
                                <div className="field-container">
                                    <textarea
                                        className={`form-control ${validationErrors.design_details ? 'input-error' : ''}`}
                                        disabled={!isEditable}
                                        placeholder="Design Details"
                                        value={currentProduct.design_details}
                                        onChange={(e) => {
                                            setCurrentProduct({ ...currentProduct, design_details: e.target.value });
                                            if (validationErrors.design_details) {
                                                const newErrors = {...validationErrors};
                                                delete newErrors.design_details;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                    ></textarea>
                                    {validationErrors.design_details && (
                                        <div className="error-tooltip">{validationErrors.design_details}</div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold mb-0">Sizes</h6>
                                    <small className="text-muted">
                                        {currentProduct.sizes.length === 0 ? 
                                            "Add sizes or use the stock field below" : 
                                            "Each size has its own stock"}
                                    </small>
                                </div>
                                
                                {currentProduct.sizes.map((size, index) => {
                                    const hasError = validationErrors.sizes && validationErrors.sizes.includes(index);
                                    return (
                                        <div key={index} className="size-row mb-3">
                                            {hasError && (
                                                <div className="size-error">Please complete both fields</div>
                                            )}
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    className={`form-control me-2 ${hasError ? 'input-error' : ''}`}
                                                    disabled={!isEditable}
                                                    placeholder="Size"
                                                    value={size.size}
                                                    onChange={(e) => {
                                                        updateSize(index, 'size', e.target.value);
                                                        if (hasError) {
                                                            const newErrors = {...validationErrors};
                                                            if (newErrors.sizes) {
                                                                newErrors.sizes = newErrors.sizes.filter(i => i !== index);
                                                                if (newErrors.sizes.length === 0) delete newErrors.sizes;
                                                                setValidationErrors(newErrors);
                                                            }
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    className={`form-control me-2 ${hasError ? 'input-error' : ''}`}
                                                    disabled={!isEditable}
                                                    placeholder="Stock"
                                                    value={size.stock}
                                                    min="0"
                                                    onChange={(e) => {
                                                        // Ensure value is not negative
                                                        const value = Math.max(0, parseInt(e.target.value) || 0);
                                                        updateSize(index, 'stock', value);
                                                        if (hasError) {
                                                            const newErrors = {...validationErrors};
                                                            if (newErrors.sizes) {
                                                                newErrors.sizes = newErrors.sizes.filter(i => i !== index);
                                                                if (newErrors.sizes.length === 0) delete newErrors.sizes;
                                                                setValidationErrors(newErrors);
                                                            }
                                                        }
                                                    }}
                                                />
                                                {isEditable && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => deleteSize(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {isEditable && (
                                    <button className="btn btn-outline-primary mb-3" onClick={addSize}>
                                        Add a size
                                    </button>
                                )}
                                
                                {/* Stock field for products without sizes */}
                                {currentProduct.sizes.length === 0 && (
                                    <>
                                        <h6 className="fw-bold mt-3">Stock</h6>
                                        <div className="field-container">
                                            <input
                                                type="number"
                                                className={`form-control ${validationErrors.stock ? 'input-error' : ''}`}
                                                disabled={!isEditable}
                                                placeholder="Total stock quantity"
                                                value={currentProduct.stock}
                                                min="0"
                                                onChange={(e) => {
                                                    // Ensure value is not negative
                                                    const value = Math.max(0, parseInt(e.target.value) || 0);
                                                    setCurrentProduct({ ...currentProduct, stock: value });
                                                    if (validationErrors.stock) {
                                                        const newErrors = {...validationErrors};
                                                        delete newErrors.stock;
                                                        setValidationErrors(newErrors);
                                                    }
                                                }}
                                            />
                                            {validationErrors.stock && (
                                                <div className="error-tooltip">{validationErrors.stock}</div>
                                            )}
                                            <small className="text-muted d-block mt-1">
                                                Required when no sizes are specified
                                            </small>
                                        </div>
                                    </>
                                )}

                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        disabled={!isEditable}
                                        checked={currentProduct.homepage}
                                        onChange={toggleHomepage}
                                    />
                                    <label className="form-check-label">Add to Homepage</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                {currentProduct.id && (
                                    <button
                                        className="btn btn-danger me-auto"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        Delete
                                    </button>
                                )}
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => {
                                        if (isEditable) {
                                            handleSaveProduct();
                                        } else {
                                            setIsEditable(true);
                                        }
                                    }}
                                    disabled={isSaving}
                                >
                                    {isEditable ? 
                                        (isSaving ? 
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </> 
                                            : 'Save') 
                                        : 'Edit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Confirmation Modal for Deletion */}
            {showDeleteConfirm && (
                <div className="modal show d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this product?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={confirmDelete}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsComp;
