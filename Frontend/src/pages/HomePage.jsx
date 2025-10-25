import React from 'react'
import CategoryItem from '../component/CategoryItem'
const categories = [
	{ href: "/Coffee-tools", name: "Coffee Tools", imageUrl: "/tools.jpg" },
	{ href: "/Mugs", name: "Mugs", imageUrl: "/red.jpg" },
	
];
const HomePage = () => {
  return (
    <div className="text-white relative min-h-screen overflow-hidden">
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        	<h1 className='text-center text-5xl sm:text-6xl font-bold text-purple-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the best coffee tools 
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{/* {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />} */}
      </div>
    </div>
  )
}

export default HomePage