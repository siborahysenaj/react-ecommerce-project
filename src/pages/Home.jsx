
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getAllProducts();

        const list = Array.isArray(data)
          ? data
          : data.products ?? data.data ?? [];

        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const name = String(
      product.productName ?? product.name ?? ""
    ).toLowerCase();

    const description = String(
      product.productDescription ?? product.description ?? ""
    ).toLowerCase();

    const price = Number(
      product.productPrice ?? product.price ?? 0
    );

    const stock = Number(product.stock ?? 0);

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      description.includes(search.toLowerCase());

    const matchesMin =
      minPrice === "" || price >= Number(minPrice);

    const matchesMax =
      maxPrice === "" || price <= Number(maxPrice);

    const matchesStock = !availableOnly || stock > 0;

    return (
      matchesSearch &&
      matchesMin &&
      matchesMax &&
      matchesStock
    );
  });

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
  }

  return (
    <div className="products-page">
      <h1>Explore Our Products</h1>
      <p>Discover products from our marketplace.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Minimum price"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Maximum price"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available only
        </label>

        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <h2>Products ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <p>No products match your search.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
