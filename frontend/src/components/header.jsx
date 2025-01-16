import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Header.css";

const Header = () => {
  const messages = [
    "FREE & FAST global shipping* on all orders",
    "Buy Cat Cave with 10% Discount",
    "FREE 4PCS Toy Ball on purchase of any Cat Cave",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [messages.length]);

  return (
    <header className="header">
      <div className="header-top">
        <span>{messages[currentMessageIndex]}</span>
        <nav>
          <Link to="#new-products">New products</Link>
          <Link to="#blog">Blog</Link>
          <Link to="#reviews">Reviews</Link>
          <Link to="#shipping-returns">Shipping & Returns</Link>
          <Link to="#faqs">FAQs</Link>
          <Link to="#contact-us">Contact Us</Link>
          <Link to="#apply-wholesale">Apply for Wholesale</Link>
        </nav>
      </div>
      <div className="header-main">
        <div className="logo">
          <img src="path/to/logo.png" alt="Art-Plus Logo" />
          <span className="tagline"></span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search our catalog" />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="certifications">
          <img src="path/to/iso.png" alt="ISO Certification" />
          <img src="path/to/sedex.png" alt="Sedex Membership" />
          <img src="path/to/goodweave.png" alt="GoodWeave Certification" />
        </div>
        <div className="user-actions">
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;