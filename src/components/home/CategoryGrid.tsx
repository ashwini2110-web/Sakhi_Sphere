import React from 'react';
import { INITIAL_CATEGORIES } from '../../lib/mock-data';

interface CategoryGridProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full py-10 bg-white border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A43E25]">
              <span className="material-symbols-outlined text-sm">grid_view</span>
              Handcrafted Disciplines
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#2B211E] mt-0.5">
              10 Quick-Access Craft Categories
            </h3>
          </div>
          <span className="text-xs text-[#6E5B55] hidden sm:inline font-medium">
            100% direct-to-artisan verification
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {INITIAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-2 group transition-all hover:scale-105 shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7EBE7] border-[#A43E25] ring-2 ring-[#A43E25]/20'
                    : 'bg-[#FBF5EE] hover:bg-[#F7EBE7]/60 border-[#EADBCE]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                  isSelected
                    ? 'bg-[#A43E25] text-white'
                    : 'bg-white text-[#A43E25] group-hover:bg-[#A43E25] group-hover:text-white'
                }`}>
                  <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                </div>
                <span className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                  isSelected ? 'text-[#A43E25]' : 'text-[#2B211E] group-hover:text-[#A43E25]'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
