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
      console.log('⚠️ No categories provided, skipping fetch');
      setData([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching products for categories:', categories);
      
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categories }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataResponse = await response.json();
      console.log('📦 Filter response:', dataResponse);
      console.log('✅ Products received:', dataResponse?.data?.length || 0);
      
      if (dataResponse?.data && Array.isArray(dataResponse.data)) {
        setData(dataResponse.data);
      } else {
        console.warn('⚠️ Unexpected response format:', dataResponse);
        setData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize category from URL on mount and when URL changes
  useEffect(() => {
    if (urlCategoryListinArray.length > 0) {
      const urlCategoryListObject = {};
      console.log('🔗 URL categories from query:', urlCategoryListinArray);
      urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
      });
      console.log('✅ Setting selected categories from URL:', urlCategoryListObject);
      setSelectCategory(urlCategoryListObject);
      // Immediately fetch products for URL categories
      console.log('🚀 Fetching products for URL categories:', urlCategoryListinArray);
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

  // Update filterCategoryList when selectCategory changes
  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .filter(key => selectCategory[key]);
    console.log('📋 Selected categories:', arrayOfCategory);
    
    if (arrayOfCategory.length > 0) {
      setFilterCategoryList(arrayOfCategory);
      
      // Update URL without triggering navigation
      const urlFormat = arrayOfCategory
        .map((el) => `category=${el}`)
        .join('&');
      const newUrl = `/product-category?${urlFormat}`;
      if (location.pathname + location.search !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    } else {
      setFilterCategoryList([]);
    }
  }, [selectCategory]);

  // Fetch data when filterCategoryList changes (but not from URL initialization)
  useEffect(() => {
    if (filterCategoryList.length > 0) {
      // Only fetch if this is a user-initiated change (not from URL)
      const urlCategories = urlSearch.getAll('category');
      const isUrlMatch = filterCategoryList.length === urlCategories.length && 
                         filterCategoryList.every(cat => urlCategories.includes(cat));
      
      if (!isUrlMatch || data.length === 0) {
        console.log('🔄 filterCategoryList changed, fetching:', filterCategoryList);
        fetchData(filterCategoryList);
      }
    }
  }, [filterCategoryList]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    if (value === 'asc') {
      setData(prev => [...prev].sort((a, b) => (a.sellingPrice || a.price || 0) - (b.sellingPrice || b.price || 0)));
    }

    if (value === 'dsc') {
      setData(prev => [...prev].sort((a, b) => (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0)));
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
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

          <div>
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

        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>
            Search Results : {data.length}
          </p>

          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length > 0 && !loading ? (
              <VerticalCard data={data} loading={loading} />
            ) : (
              <p className='text-slate-500'>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
