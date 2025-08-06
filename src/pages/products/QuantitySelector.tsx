import React from "react";

interface Props {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const QuantitySelector: React.FC<Props> = ({ quantity, setQuantity }) => {
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="flex items-center border rounded-lg">
      <button onClick={decrement} className="px-4 py-2 text-lg">
        -
      </button>
      <span className="px-4 py-2 text-lg">{quantity}</span>
      <button onClick={increment} className="px-4 py-2 text-lg">
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
