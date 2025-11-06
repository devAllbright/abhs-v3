import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import Step3 from "./Step3.jsx";

const HomeCondition = () => {
  return (
    <ShoppingCartProvider>
      <Step3 />
    </ShoppingCartProvider>
  );
};

export default HomeCondition;
