import React, { useState, useEffect } from "react";

const CategoryComp = ({ onBack }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCategory, setNewCategory] = useState({ category: "", img: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch("http://localhost:3001/api/categories")
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error fetching categories:", error));
    };

    const openAddModal = () => {
        setNewCategory({ category: "", img: "" });
        setSelectedCategory(null);
        setIsEditing(false);
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setNewCategory(category);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const addCategory = () => {
        fetch("http://localhost:3001/api/categories/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
        })
            .then(response => response.json())
            .then(() => {
                fetchCategories();
                setShowModal(false);
            })
            .catch(error => console.error("Error adding category:", error));
    };

    const updateCategory = () => {
        fetch(`http://localhost:3001/api/categories/edit/${selectedCategory._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
        })
            .then(response => response.json())
            .then(() => {
                fetchCategories();
                setShowModal(false);
            })
            .catch(error => console.error("Error updating category:", error));
    };

    const openDeleteModal = () => {
        setShowModal(false);
        setShowDeleteModal(true);
    };

    const deleteCategory = () => {
        fetch(`http://localhost:3001/api/categories/delete/${selectedCategory._id}`, {
            method: "DELETE",
        })
            .then(() => {
                fetchCategories();
                setShowDeleteModal(false);
            })
            .catch(error => console.error("Error deleting category:", error));
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={onBack}>Back to Dashboard</button>

                <h2 className="text-center">Category Management</h2>

                <button className="btn btn-primary" onClick={openAddModal}>Add Category</button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered border-dark text-center">
                    <thead className="table-dark">
                        <tr>
                            <th className="table-header">Image</th>
                            <th className="table-header">Category Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <tr
                                    key={category._id}
                                    onClick={() => openEditModal(category)}
                                    className="category-row"
                                    style={{ cursor: "pointer", backgroundColor: "rgba(112, 112, 112, 0.2)"  }}
                                >
                                    <td className="align-middle">
                                        <img src={category.img} alt={category.category} className="category-image" />
                                    </td>
                                    <td className="align-middle">{category.category}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">{selectedCategory ? "Category Details" : "Add Category"}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="category"
                                        value={newCategory.category}
                                        onChange={handleInputChange}
                                        disabled={selectedCategory && !isEditing}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="img"
                                        value={newCategory.img}
                                        onChange={handleInputChange}
                                        disabled={selectedCategory && !isEditing}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                {selectedCategory ? (
                                    <>
                                        {!isEditing ? (
                                            <>
                                                <button className="btn btn-warning" onClick={() => setIsEditing(true)}>Edit</button>
                                                <button className="btn btn-danger" onClick={openDeleteModal}>Delete</button>
                                            </>
                                        ) : (
                                            <button className="btn btn-success" onClick={updateCategory}>Save</button>
                                        )}
                                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={addCategory}>Add</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this category?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={deleteCategory}>Yes, Delete</button>
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryComp;
