"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"; // For Modal
import type { Restaurant } from "~/lib/types/restaurant";

import { IoFilterSharp } from "react-icons/io5";

export default function RestaurantGrid({ initialRestaurants }: { initialRestaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const fetchRestaurants = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch restaurants.");

      const data = (await response.json()) as Restaurant[];
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleFilter = async (filterType: string) => {
    if (filterType === "orderCount") {
      await fetchRestaurants("/api/restaurants/byOrderCount");
    } else if (filterType === "alphabetical") {
      await fetchRestaurants("/api/restaurants/alphabetical");
    }
    setIsFilterModalOpen(false); 
  };

  return (
    <div>
      {/* Filter Button */}
      <Button onClick={() => setIsFilterModalOpen(true)} variant="outline" className="mx-14 mt-8">
        <IoFilterSharp />
        Filter
      </Button>

      {/* Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Restaurants</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button onClick={() => handleFilter("orderCount")} variant="default">
              Most Ordered
            </Button>
            <Button onClick={() => handleFilter("alphabetical")} variant="default">
              Sort Alphabetically
            </Button>
            <Button onClick={() => setIsFilterModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-14">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.restaurant_id} className="hover:shadow-lg transition-shadow text-secondaryCustom">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
              <a href={`/${restaurant.restaurant_id}`}>
                <Button className="mt-4 w-full" variant="outline">
                  View Details
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
