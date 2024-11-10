import React from "react";
import './Categories.css';
import pants from '../assets/trousers.png';
import tee from '../assets/tshirt.png';
import shirt from '../assets/shirt.png';
import shoes from '../assets/shoes.png';
import ring from '../assets/ring.png';
import { Link, useParams } from "react-router-dom";

function Categories() {
  const { cat } = useParams();

  const categories = [
    { category: "Tees", img: tee },
    { category: "Button-Shirts", img: shirt },
    { category: "Pants", img: pants },
    { category: "Shoes", img: shoes },
    { category: "Accessories", img: ring }
  ];

  return (
    <>
      <div className="categories">
        {categories.map((item, index) => (
          <div className="category-item" key={index}>
            <Link 
              to={`/category/${item.category}`} 
              className={`img-div ${cat === item.category ? 'active' : ''}`}
            >
              <img src={item.img} alt={item.category} className="category-img" />
            </Link>
            <p>{item.category}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Categories;