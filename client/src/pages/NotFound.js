import React from 'react';
import { CgSmileSad } from "react-icons/cg";
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mt-5">
      
      <h1>404 Not Found <CgSmileSad className='mb-2'/></h1>
      <p className="mt-4">
        The page you are looking for does not exist.
      </p>

      <Link to='/' className='btn btn-dark btn-lg mt-5'>Go to Home Page</Link>
    </div>
  );
}

export default NotFound;