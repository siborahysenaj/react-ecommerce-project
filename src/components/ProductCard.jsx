
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const id = product.id;
  const name = product.productName ?? product.name ?? "Unnamed Product";
  const description =
    product.productDescription ?? product.description ?? "";
  const price = product.productPrice ?? product.price ?? 0;
  const stock = product.stock ?? 0;

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={name} />
        ) : (
          <span>No image available</span>
        )}
      </div>

      <div className="product-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <h3>€{Number(price).toFixed(2)}</h3>

        <p>{stock > 0 ? `In stock: ${stock}` : "Out of stock"}</p>

        <Link to={`/products/${id}`} className="details-button">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
