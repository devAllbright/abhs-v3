import { ShoppingCartProvider } from "../../../context/ShoppingCartContext";
import FinalSummaryComponent from "./FinalSummary";

const HomeDetails = () => {
  return (
    <ShoppingCartProvider>
      <FinalSummaryComponent />
    </ShoppingCartProvider>
  );
};

export default HomeDetails;
