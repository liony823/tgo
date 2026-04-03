interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onChange }: CategoryTabsProps) => {
  return (
    <div className="px-4 py-3">
      <div className="overflow-x-auto whitespace-nowrap">
        <div className="flex gap-3">
          {categories.map(category => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-yellow-700 text-white shadow-sm'
                    : 'bg-[#efebe3] text-[#504638] active:scale-95'
                ].join(' ')}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
