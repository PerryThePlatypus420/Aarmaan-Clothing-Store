import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const CategoryComp = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState({ category: "", img: "" });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    // Get the authentication token
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const openAddModal = () => {
    setNewCategory({ category: "", img: "" });
    setSelectedCategory(null);
    setIsEditing(false);
    setShowModal(true);
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Update the handleImageUpload function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory({ ...newCategory, img: reader.result });
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Update the openEditModal function
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategory({
      ...category,
      img: category.img, // The image is already in base64 format from the backend
    });
    setIsEditing(false);
    setShowModal(true);
    setImageFile(null);
  };

  const addCategory = () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("category", newCategory.category);
    if (imageFile) {
      formData.append("img", imageFile);
    }

    // Get the authentication token
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/categories/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        setShowModal(false);
        toast.success("Category added successfully!");
      })
      .catch((error) => {
        console.error("Error adding category:", error);
        toast.error("Error adding category. Please try again.");
      })
      .finally(() => setIsSaving(false));
  };

  const updateCategory = () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("category", newCategory.category);
    if (imageFile) {
      formData.append("img", imageFile);
    }

    // Get the authentication token
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/categories/edit/${selectedCategory._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        setShowModal(false);
        toast.success("Category updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        toast.error("Error updating category. Please try again.");
      })
      .finally(() => setIsSaving(false));
  };

  const openDeleteModal = () => {
    setShowModal(false);
    setShowDeleteModal(true);
  };
  const deleteCategory = () => {
    setIsSaving(true);
    // Get the authentication token
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/categories/delete/${selectedCategory._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchCategories();
        setShowDeleteModal(false);
        toast.success("Category deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category. Please try again.");
      })
      .finally(() => setIsSaving(false));
  };

  const renderImage = (imageData) => {
    if (!imageData) return null;

    try {
      // If it's already a valid data URL, return it
      if (imageData.startsWith("data:image")) {
        return imageData;
      }
      return null;
    } catch (error) {
      console.error("Error rendering image:", error);
      return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
        <button className="btn btn-secondary mb-2 mb-sm-0" onClick={onBack}>
          Back to Dashboard
        </button>
        <h2 className="text-center flex-grow-1 mb-2 order-h1 mb-sm-0">
          Category Management
        </h2>
        <button className="btn btn-primary order-h1" onClick={openAddModal}>
          Add Category
        </button>
      </div>

      <div className="text-center mb-2">
        <span className="badge bg-info text-dark">
          Total Categories:
          <span className="fs-6"> {categories.length}</span>
        </span>
      </div>

      <div className="row g-3 mt-4 mb-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={category._id}
            >
              <div
                className="card h-100"
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgba(255, 255, 255, 0.73)",
                }}
                onClick={() => openEditModal(category)}
              >
                <img
                  src={renderImage(category.img)}
                  className="card-img-top"
                  alt={category.category}
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body d-flex justify-content-center align-items-center">
                  <h5 className="card-title text-center">
                    {category.category}
                  </h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No categories found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  {selectedCategory ? "Category Details" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
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
                    disabled={selectedCategory}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={selectedCategory && !isEditing}
                  />
                  {newCategory.img && (
                    <div className="mt-2">
                      <img
                        src={newCategory.img}
                        alt="Preview"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                {selectedCategory ? (
                  <>
                    {!isEditing ? (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={openDeleteModal}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={updateCategory}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    )}
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                      disabled={isSaving}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={addCategory}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
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
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this category?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={deleteCategory}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryComp;
