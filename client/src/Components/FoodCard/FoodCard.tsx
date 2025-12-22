import type { Food } from "../../models/food.model";
import {
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Utensils
} from "lucide-react";

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  return (
    <div className="bg-white rounded-2xl border hover:shadow-xl transition hover:scale-101 ease-in cursor-pointer p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">
            {food.name}
          </h2>
        </div>
        <span className="text-sm text-gray-400">
          {new Date(food.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600">
            <Flame size={16} />
            <span>Calories</span>
          </div>
          <span className="font-semibold">{food.calories} kcal</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600">
            <Drumstick size={16} />
            <span>Protein</span>
          </div>
          <span className="font-semibold">{food.protein} g</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600">
            <Wheat size={16} />
            <span>Carbs</span>
          </div>
          <span className="font-semibold">{food.carbs} g</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600">
            <Droplet size={16} />
            <span>Fats</span>
          </div>
          <span className="font-semibold">{food.fats} g</span>
        </div>
      </div>
    </div>
  );
}
