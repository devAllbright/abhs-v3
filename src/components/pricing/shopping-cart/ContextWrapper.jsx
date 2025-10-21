import ShoppingCart from '../ShoppingCart'
import { ShoppingCartProvider } from '../../../context/ShoppingCartContext'

export default function ContextWrapper() {
  return (
    <>

      <ShoppingCartProvider>
        <ShoppingCart />
      </ShoppingCartProvider>
    
    </>
  )
}