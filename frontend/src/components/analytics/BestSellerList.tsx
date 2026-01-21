import React from 'react';
import { Eye, Heart } from 'lucide-react';
import { Card } from '../ui/Card';

interface MenuItem {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
    views: number;
    likes: number;
}

interface BestSellerListProps {
    items: MenuItem[];
}

export const BestSellerList: React.FC<BestSellerListProps> = ({ items }) => {
    return (
        <Card padding="lg">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Best Seller (Menus)</h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
                    >
                        {/* Image */}
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64';
                            }}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-900 truncate group-hover:text-primary transition-colors">
                                {item.name}
                            </h4>
                            <p className="text-sm font-bold text-primary mt-0.5">
                                {item.price}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-1 text-neutral-500">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs font-medium">{item.views}</span>
                            </div>
                            <div className="flex items-center gap-1 text-neutral-500">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs font-medium">{item.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
