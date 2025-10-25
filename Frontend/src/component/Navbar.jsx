import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { ShoppingCart,UserPlus,LogIn,LogOut,Lock } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore';
const Navbar = () => {
  const {user,logout} = useUserStore();
  const isAdmin = user?.rule === "admin";
  const {cart} = useCartStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect after logout
  };
  return (
    <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-purple-800'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex flex-wrap items-center justify-between'>
        <Link to="/" className='text-2xl font-bold text-purple-400 hover:text-purple-600 items-center space-x-2 flex '>Lupinus</Link>
        <nav className='flex flex-wrap items-center gap-4'>
          <Link to="/" className='text-gray-300 hover:text-purple-400 transition duration-300 ease-in-out'>Home</Link>
          {user && (
            <Link to={"/cart"} className='relative group text-gray-300 hover:text-purple-400 transition duration-300 ease-in-out '>
              <ShoppingCart className='group-hover:text-purple-400 inline-block mr-1 ' size={20}/>
              <span className='hidden sm:inline'>Cart</span>
              {cart.length > 0 &&(<span className='absolute -top-3.5 -left-2 bg-purple-500 text-white rounded-full px-1.5 py-0.5 text-xs group-hover:bg-purple-400 transition duration-300 ease-in-out'>{cart.length}</span>)}
            </Link>
          )}
          {isAdmin && (
            <Link className='bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center' to={"/secret-dashboard"}>
                  <Lock className='inline-block mr-1' size={16}/>
                  <span className=' sm-inline'>Dashboard</span>
                 </Link>
          )} {
            user ? (
              <button className='cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out'  onClick={handleLogout} >
                <LogOut className='inline-block mr-2' size={18}/>
                <span className='hidden sm:inline'>Logout</span>
              </button>
            )
         : (
            <>
            <Link to={"/signup"} className='bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center transtion duration-300 ease-in-out'>
            <UserPlus className='mr-2' size={18}/>
              Sign Up
            </Link>
            <Link to={"/login"} className='bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md font-medium'>
              <LogIn className='mr-2' size={18}/>
              Login
            </Link>
            </>
)}
        </nav>
        </div>
      </div>
    </header> 
    
  )
}

export default Navbar