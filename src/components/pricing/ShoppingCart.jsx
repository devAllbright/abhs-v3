import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import CartLayoutSwitcher from "./CartLayoutSwitcher";
import "../../styles/pricing/shopping-cart.css";

export default function ShoppingCart() {
  return (
    <ShoppingCartProvider>
      <CartLayoutSwitcher />
    </ShoppingCartProvider>
  );
}
