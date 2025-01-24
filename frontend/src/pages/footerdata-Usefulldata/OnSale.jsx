import React, { useEffect, useState } from 'react';

const ProductsOnSale = () => {
    const [saleProducts, setSaleProducts] = useState([]);

    useEffect(() => {
        const fetchSaleProducts = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/shop/sale');
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Fetched sale products:", result); // Log the response
            if (result.success) {
              setSaleProducts(result.data);
            } else {
              console.error('Error:', result.message);
            }
          } catch (error) {
            console.error('Error fetching sale products:', error);
          }
        };
      
        fetchSaleProducts();
      }, []);
      
    
      return (
        <div>
          <h1>Products on Sale</h1>
          <div className="products-grid">
            {saleProducts.length > 0 ? (
              saleProducts.map(product => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h2>{product.title}</h2>
                  <p>Price: ${product.salePrice || product.price}</p>
                  <p>{product.description}</p>
                </div>
              ))
            ) : (
              <p>No products on sale right now.</p>
            )}
          </div>
        </div>
      );
      
};

export default ProductsOnSale;