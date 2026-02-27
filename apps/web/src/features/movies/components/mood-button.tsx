import { cn } from '#/lib/utils';
import { ElementType } from 'react';

export interface MoodButtonProps {
    label: string;
    icon: ElementType;
    isActive: boolean;
    onClick: () => void;
}

export function MoodButton({ label, icon: Icon, isActive, onClick }: MoodButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 md:gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 transform",
                isActive
                    ? "bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    : "bg-black/40 border border-white/20 text-white hover:bg-white/20 hover:scale-105 backdrop-blur-md"
            )}
        >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
            {label}
        </button>
    );
}
