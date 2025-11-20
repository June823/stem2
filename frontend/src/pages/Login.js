import React, { useContext, useState } from 'react';
import loginIcons from '../assets/signin.gif';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!dataResponse.ok) throw new Error(`HTTP error! status: ${dataResponse.status}`);

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        if (dataApi.token) localStorage.setItem('token', dataApi.token);

        const user = await fetchUserDetails();
        fetchUserAddToCart();
        if (user && (user.role || '').toUpperCase() === 'ADMIN') {
          navigate('/admin-panel');
        } else {
          navigate('/');
        }
      }

      if (dataApi.error) toast.error(dataApi.message);
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Failed to connect to server. Please check if the server is running.');
    }
  };

  return (
    <section id='login'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Email : </label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='email'
                  placeholder='enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            <div>
              <label>Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                />
                <div
                  className='cursor-pointer text-xl'
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <Link
                to={'/forgot-password'}
                className='block w-fit ml-auto hover:underline hover:text-red-600'
              >
                Forgot password ?
              </Link>
            </div>

            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
              Login
            </button>
          </form>

          <p className='my-5'>
            Don't have account ?{' '}
            <Link
              to={'/sign-up'}
              className='text-red-600 hover:text-red-700 hover:underline'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
