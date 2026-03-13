import { FaTrash } from "react-icons/fa";
import { getProductImage } from "../utils/productImages";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="cart-item">
      <img
        src={getProductImage(item.product?.productId, 80, 80)}
        alt={item.product.productName}
        className="cart-item-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80";
        }}
      />
      <div className="cart-item-info">
        <h4>{item.product.productName}</h4>
        <p>Price: ${item.product.productPriceAfterDiscount}</p>
      </div>
      <div className="cart-item-controls">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>
      <div className="cart-item-total">
        <p>
          ${(item.product.productPriceAfterDiscount * item.quantity).toFixed(2)}
        </p>
      </div>
      <button className="btn-remove" onClick={() => removeItem(item.id)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
