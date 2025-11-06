import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import Step2 from "./Step2.jsx";

const HomeDetails = () => {
  return (
    <ShoppingCartProvider>
      <Step2 />
    </ShoppingCartProvider>
  );
};

export default HomeDetails;
