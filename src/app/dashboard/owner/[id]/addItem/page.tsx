'use client';

import { use } from 'react';
import { useState } from 'react';

export default function AddMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Promise çözülüyor
  const { id } = resolvedParams;

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <form
        action="/api/addItem"
        method="post"
        className="flex flex-col gap-4 p-4 rounded-lg shadow-lg"
      >
        <input type="hidden" name="restaurantId" value={id} />

        <label>
          <span>Item Name</span>
          <input
            className="text-black"
            type="text"
            name="name"
            placeholder="Item Name"
            required
          />
        </label>
        <label>
          <span>Description</span>
          <input
            className="text-black"
            type="text"
            name="description"
            placeholder="Item Description"
          />
        </label>
        <label>
          <span>Price</span>
          <input
            className="text-black"
            type="number"
            name="price"
            placeholder="Price"
            required
          />
        </label>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleCategoryClick("starter")}
            className={`w-full p-2 rounded-md ${
              selectedCategory === "starter" ? "bg-blue-500 text-white" : "bg-white text-black"
            } hover:bg-gray-300`}
          >
            Starter
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick("main_course")}
            className={`w-full p-2 rounded-md ${
              selectedCategory === "main_course" ? "bg-blue-500 text-white" : "bg-white text-black"
            } hover:bg-gray-300`}
          >
            Main Course
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick("dessert")}
            className={`w-full p-2 rounded-md ${
              selectedCategory === "dessert" ? "bg-blue-500 text-white" : "bg-white text-black"
            } hover:bg-gray-300`}
          >
            Dessert
          </button>
        </div>

        <input type="hidden" name="category" value={selectedCategory} />

        <label>
          <span>Image URL</span>
          <input
            className="text-black"
            type="text"
            name="imageUrl"
            placeholder="Image URL"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 p-2 rounded hover:bg-blue-700 mt-4"
        >
          Add Item
        </button>
      </form>
    </main>
  );
}
