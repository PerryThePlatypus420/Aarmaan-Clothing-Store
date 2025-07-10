import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Categories.css";

const API_URL = process.env.REACT_APP_API_URL;

function Categories() {
  const { cat } = useParams();
  const [categories, setCategories] = useState([]);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setItemsPerSlide(1); // 1 item per slide on mobile
      } else if (window.innerWidth <= 768) {
        setItemsPerSlide(2); // 2 items per slide on tablet
      } else {
        setItemsPerSlide(3); // 3 items per slide on desktop
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chunk categories into groups based on screen size
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += itemsPerSlide) {
    chunkedCategories.push(categories.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="categories-section">
      <div className="container-fluid">
        <div id="categoryCarousel" className="carousel slide position-relative" data-bs-ride="carousel">
          <div className="carousel-inner">
            {chunkedCategories.map((group, idx) => (
              <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
                <div className="row justify-content-center g-0">
                  {group.map((item, index) => (
                    <div className={`col-${12/itemsPerSlide} text-center`} key={index}>
                      <div className="category-item">
                        <Link
                          to={`/category/${item.category}`}
                          className={`category-link ${cat === item.category ? "active-category" : ""
                            }`}
                        >
                          <div className="category-image-container">
                            <img
                              src={item.img}
                              alt={item.category}
                              className="category-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.backgroundColor = '#e5e7eb';
                              }}
                            />
                          </div>
                          <h6 className="category-name">{item.category}</h6>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          {chunkedCategories.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#categoryCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#categoryCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;