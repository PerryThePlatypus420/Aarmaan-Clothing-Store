import React, { useState, useEffect } from "react";

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

    // ✅ Fetch categories, products, and homepage products
    useEffect(() => {
        fetch('http://localhost:3001/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.map(cat => cat.category)))
            .catch(err => console.error(err));

        fetch('http://localhost:3001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data.map(p => ({ ...p, id: p._id.toString() }))))
            .catch(err => console.error(err));

        fetch('http://localhost:3001/api/homepage-products')
            .then(res => res.json())
            .then(data => setHomepageProducts(data.map(hp => hp.productID._id.toString())))
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

            setCurrentProduct({
                ...product,
                homepage: homepageProducts.includes(product.id),
                images: existingImageFields.map(field => field.url)
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
            ? `http://localhost:3001/api/products/edit/${currentProduct.id}`
            : 'http://localhost:3001/api/products/add';
        const method = isEditing ? 'PUT' : 'POST';

        const formData = new FormData();
        formData.append("category", currentProduct.category);
        formData.append("title", currentProduct.title);
        formData.append("price", currentProduct.price);
        formData.append("description", currentProduct.description);
        formData.append("design_details", currentProduct.design_details);
        formData.append("sizes", JSON.stringify(currentProduct.sizes));
        formData.append("homepage", currentProduct.homepage);

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

        fetch(url, {
            method,
            body: formData,
        })
            .then(res => res.json())
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
                const homepageUrl = currentProduct.homepage
                    ? 'http://localhost:3001/api/homepage-products/add'
                    : `http://localhost:3001/api/homepage-products/delete/${data.product._id}`;
                const homepageMethod = currentProduct.homepage ? 'POST' : 'DELETE';

                fetch(homepageUrl, {
                    method: homepageMethod,
                    headers: { 'Content-Type': 'application/json' },
                    body: currentProduct.homepage ? JSON.stringify({ productID: data.product._id }) : null
                })
                    .then(() => {
                        setHomepageProducts(currentProduct.homepage
                            ? [...homepageProducts, data.product._id]
                            : homepageProducts.filter(id => id !== data.product._id)
                        );
                    })
                    .catch(err => console.error("Error updating homepage:", err));

                setShowModal(false);
            })
            .catch(err => console.error("Error saving product:", err));
    };

    // ✅ Handle Product Deletion with Confirmation Modal
    const confirmDelete = () => {
        fetch(`http://localhost:3001/api/products/delete/${currentProduct.id}`, { method: 'DELETE' })
            .then(() => {
                setProducts(products.filter(product => product.id !== currentProduct.id));
                setShowDeleteConfirm(false);
                setShowModal(false);
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
        updatedSizes[index][key] = value;
        setCurrentProduct({ ...currentProduct, sizes: updatedSizes });
    };

    const deleteSize = (index) => {
        const updatedSizes = currentProduct.sizes.filter((_, i) => i !== index);
        setCurrentProduct({ ...currentProduct, sizes: updatedSizes });
    };

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="p-2">
            <div className="d-flex justify-content-between align-items-center mb-4 top-bar">
                <button className="btn btn-secondary border mb-2" onClick={onBack}>
                    BACK TO DASHBOARD
                </button>
                <h2 className="fw-normal mb-2">Product Management</h2>
                <div className="d-flex align-items-center">
                    <span className="me-2 fw-bold mb-2">Filter:</span>
                    <select
                        className="form-select border"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        value={selectedCategory}
                        style={{ width: "120px" }}
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

            <button className="btn btn-success" onClick={() => openModal()}>
                Add Product
            </button>

            <div className="d-flex flex-wrap gap-4 mt-4">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="card border-0"
                        style={{ width: '18rem', cursor: 'pointer', borderRadius: '15px' }}
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
                                    fontSize: '0.8rem'
                                }}
                            >
                                Featured
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
                                <select
                                    className="form-select mb-2"
                                    disabled={!isEditable}
                                    value={currentProduct.category}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                >
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <h6 className="fw-bold">Title</h6>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    disabled={!isEditable}
                                    placeholder="Title"
                                    value={currentProduct.title}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                                />

                                <h6 className="fw-bold">Price</h6>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    disabled={!isEditable}
                                    placeholder="Price"
                                    value={currentProduct.price}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                />

                                {/* Image Fields with Add Button */}
                                <h6 className="fw-bold">Images</h6>
                                {imageFields.map((field, index) => (
                                    <div key={field.id} className="d-flex align-items-center mb-2">
                                        <input
                                            type="file"
                                            className="form-control"
                                            disabled={!isEditable}
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
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
                                {isEditable && (
                                    <button className="btn btn-outline-primary mb-3" onClick={addImageField}>
                                        Add Another Image
                                    </button>
                                )}

                                <h6 className="fw-bold">Description</h6>
                                <textarea
                                    className="form-control mb-2"
                                    disabled={!isEditable}
                                    placeholder="Description"
                                    value={currentProduct.description}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                ></textarea>

                                <h6 className="fw-bold">Design Details</h6>
                                <textarea
                                    className="form-control mb-2"
                                    disabled={!isEditable}
                                    placeholder="Design Details"
                                    value={currentProduct.design_details}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, design_details: e.target.value })}
                                ></textarea>

                                <h6 className="fw-bold">Sizes</h6>
                                {currentProduct.sizes.map((size, index) => (
                                    <div key={index} className="d-flex mb-2 align-items-center">
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            disabled={!isEditable}
                                            placeholder="Size"
                                            value={size.size}
                                            onChange={(e) => updateSize(index, 'size', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            className="form-control me-2"
                                            disabled={!isEditable}
                                            placeholder="Stock"
                                            value={size.stock}
                                            onChange={(e) => updateSize(index, 'stock', e.target.value)}
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
                                ))}
                                {isEditable && (
                                    <button className="btn btn-outline-primary mb-3" onClick={addSize}>
                                        Add a size
                                    </button>
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
                                <button className="btn btn-primary" onClick={() => {
                                    if (isEditable) {
                                        handleSaveProduct();
                                    } else {
                                        setIsEditable(true);
                                    }
                                }}>
                                    {isEditable ? 'Save' : 'Edit'}
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
