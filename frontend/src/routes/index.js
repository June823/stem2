import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AdminDashboard from '../pages/AdminDashboard'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import AboutUs from '../pages/AboutUs'
import Contact from '../pages/Contact' 
import Services from '../pages/Services' 
import Cart from '../pages/Cart'
import Checkout from '../components/Checkout'
import SearchProduct from '../pages/SearchProduct'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "sign-up",
                element : <SignUp/>
            },
            {
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
           // Add these to your routing configuration
{
    path : "about-us",
    element : <AboutUs/>
},
{
    path : "contact",
    element : <Contact/>
},
{
    path : "services",
    element : <Services/> // Create a similar simple component for Services
},
            {
                path : 'cart',
                element : <Cart/>
            },
            {
                path : 'checkout',
                element : <Checkout/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        index: true,
                        element: <AdminDashboard />
                    },
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "all-products",
                        element : <AllProducts/>
                    }
                ]
            },
        ]
    }
])


export default router
