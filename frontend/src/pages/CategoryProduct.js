import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState({});
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll('category');

  const fetchData = async (categories) => {
    if (!categories || categories.length === 0) {
      setData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categories }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataResponse = await response.json();
      
      if (dataResponse?.data && Array.isArray(dataResponse.data)) {
        // ✅ FIX: Only show products that ARE NOT deleted
        const activeProducts = dataResponse.data.filter(p => !p.deleted);
        setData(activeProducts);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlCategoryListinArray.length > 0) {
      const urlCategoryListObject = {};
      urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
      });
      setSelectCategory(urlCategoryListObject);
      fetchData(urlCategoryListinArray);
    }
  }, [location.search]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({
      ...prev,
      [value]: checked,
    }));
  };

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .filter(key => selectCategory[key]);
    
    if (arrayOfCategory.length > 0) {
      setFilterCategoryList(arrayOfCategory);
      const urlFormat = arrayOfCategory.map((el) => `category=${el}`).join('&');
      const newUrl = `/product-category?${urlFormat}`;
      if (location.pathname + location.search !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    } else {
      setFilterCategoryList([]);
    }
  }, [selectCategory]);

  useEffect(() => {
    if (filterCategoryList.length > 0) {
      const urlCategories = urlSearch.getAll('category');
      const isUrlMatch = filterCategoryList.length === urlCategories.length && 
                         filterCategoryList.every(cat => urlCategories.includes(cat));
      
      if (!isUrlMatch || data.length === 0) {
        fetchData(filterCategoryList);
      }
    }
  }, [filterCategoryList]);

  // ✅ IMPROVED SORTING: Uses fallback price so sorting is accurate
  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    setData(prev => [...prev].sort((a, b) => {
      const priceA = a?.sellingPrice > 0 ? a.sellingPrice : (a?.price || 0);
      const priceB = b?.sellingPrice > 0 ? b.sellingPrice : (b?.price || 0);

      if (value === 'asc') return priceA - priceB;
      if (value === 'dsc') return priceB - priceA;
      return 0;
    }));
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
        {/* Sidebar */}
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value='asc' />
                <label>Price - Low to High</label>
              </div>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value='dsc' />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>

          <div className='mt-4'>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              {productCategory.map((categoryName, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    name='category'
                    checked={selectCategory[categoryName?.value] || false}
                    value={categoryName?.value}
                    id={categoryName?.value}
                    onChange={handleSelectCategory}
                  />
                  <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>
            Search Results : {data.length}
          </p>

          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)] scrollbar-none'>
            {data.length > 0 && !loading ? (
              <VerticalCard data={data} loading={loading} />
            ) : (
              !loading && <p className='text-slate-500 text-center mt-10'>No products found in this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
