'use client';

import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productCategories } from './productData';

export default function ProductsSection() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  const category = productCategories[categoryIndex];
  const product = category.products[productIndex];

  const nextCategory = useCallback(() => {
    setCategoryIndex((i) => (i + 1) % productCategories.length);
    setProductIndex(0);
  }, []);

  const prevCategory = useCallback(() => {
    setCategoryIndex((i) =>
      i === 0 ? productCategories.length - 1 : i - 1
    );
    setProductIndex(0);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-16 transition-colors duration-500"
      style={{ backgroundColor: product.background }}
    >
      {/* CATEGORY ARROWS */}
      <button
        onClick={prevCategory}
        className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-white p-2 lg:block"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={nextCategory}
        className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-white p-2 lg:block"
      >
        <ChevronRight />
      </button>

      {/* TITLE */}
      <h2 className="mb-10 text-center text-3xl font-bold text-white">
        {category.name}
      </h2>

      {/* MAIN CONTENT */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="order-2 text-white lg:order-1">
          <p className="max-w-md text-sm leading-relaxed lg:text-base">
            {product.text.left}
          </p>

          <button className="relative mt-6 rounded-full bg-white px-6 py-2 font-medium text-blue-600">
            {product.text.cta}
            <span className="absolute bottom-[-8px] left-6 h-4 w-6 rounded-b-full bg-white" />
          </button>
        </div>

        {/* CENTER */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={product.id}
              src={product.images.main}
              alt=""
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="z-10 max-h-[420px] object-contain"
            />
          </AnimatePresence>

          <p className="mt-6 text-sm font-semibold text-black">
            {String(productIndex + 1).padStart(2, '0')} /{' '}
            {String(category.products.length).padStart(2, '0')}
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative order-3 flex justify-center lg:justify-end">
          {/* BIG CLOUD */}
          <div className="relative z-10 max-w-xs rounded-[40px] bg-white p-6 text-sm text-gray-800">
            {product.text.right}
          </div>

          {/* SMALL CLOUD */}
          <div className="absolute bottom-[-40px] right-10 rounded-[30px] bg-white px-4 py-2 text-xs text-gray-700">
            {product.text.rightSmall}
          </div>

          {/* DECORATIONS */}
          <img
            src={product.decorations.stars}
            alt=""
            className="absolute right-6 top-6 hidden w-20 lg:block"
          />
          <img
            src={product.decorations.flower}
            alt=""
            className="absolute right-20 top-[-80px] hidden w-24 lg:block"
          />
          <img
            src={product.decorations.mint}
            alt=""
            className="absolute right-0 top-20 hidden w-20 lg:block"
          />
          <img
            src={product.decorations.ice}
            alt=""
            className="absolute bottom-10 left-[-40px] hidden w-24 lg:block"
          />
        </div>
      </div>

      <div className="mt-16 flex justify-center gap-6 overflow-x-auto px-6">
        {category.products.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setProductIndex(i)}
            className={`transition-transform duration-300 ${
              i === productIndex ? 'scale-110' : ''
            }`}
          >
            <img
              src={item.images.thumb}
              alt=""
              className="h-24 w-auto object-contain"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
