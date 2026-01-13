import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const QuantitySelector: React.FC<Props> = ({ quantity, setQuantity }) => {
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="flex items-center gap-4 bg-secondary/30 border-2 border-border/50 rounded-2xl p-1 w-fit">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-background transition-colors"
        onClick={decrement}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center font-black text-xl">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl hover:bg-background transition-colors"
        onClick={increment}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
