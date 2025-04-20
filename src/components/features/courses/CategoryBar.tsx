
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "lucide-react";

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'programming', label: 'Lập trình' },
  { id: 'design', label: 'Thiết kế' },
  { id: 'business', label: 'Kinh doanh' },
  { id: 'language', label: 'Ngoại ngữ' },
  { id: 'marketing', label: 'Marketing' },
];

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <div className="w-full py-4">
      <div className="container">
        <div className="flex items-center gap-2 mb-2">
          <Category className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Danh mục</h3>
        </div>
        <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full justify-start gap-2 h-auto flex-wrap bg-transparent p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-full border bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryBar;
