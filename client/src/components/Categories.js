import React, { useState, useEffect, useRef } from "react";
import "./Categories.css";
import { Link, useParams } from "react-router-dom";

function Categories() {
  const { cat } = useParams();
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories") // Fetch categories from backend
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Function to scroll left
  const scrollLeft = () => {
    if (carouselRef.current) {
      if (carouselRef.current.scrollLeft === 0) {
        // Loop to the last category
        carouselRef.current.scrollLeft = carouselRef.current.scrollWidth;
      } else {
        carouselRef.current.scrollLeft -= 150;
      }
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (carouselRef.current) {
      if (
        carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
        carouselRef.current.scrollWidth
      ) {
        // Loop to the first category
        carouselRef.current.scrollLeft = 0;
      } else {
        carouselRef.current.scrollLeft += 150;
      }
    }
  };

  return (
    <div className="carousel-container">
      <button className="carousel-btn left" onClick={scrollLeft}>&#9664;</button>
      <div className="categories-carousel" ref={carouselRef}>
        {categories.length > 0 ? (
          categories.map((item, index) => (
            <div className="category-item" key={index}>
              <Link
                to={`/category/${item.category}`}
                className={`img-div ${cat === item.category ? "active" : ""}`}
              >
                <img src={item.img} alt={item.category} className="category-img" />
              </Link>
              <p>{item.category}</p>
            </div>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
      <button className="carousel-btn right" onClick={scrollRight}>&#9654;</button>
    </div>
  );
}

export default Categories;
