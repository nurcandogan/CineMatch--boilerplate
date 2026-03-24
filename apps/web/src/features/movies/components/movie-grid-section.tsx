import type { ReactNode } from 'react';

export interface MovieGridSectionProps {
    title?: ReactNode;
    icon?: ReactNode;
    children: ReactNode;
    isEmpty?: boolean;
    emptyMessage?: string;
    emptyIcon?: ReactNode;
}

export function MovieGridSection({
    title,
    icon,
    children,
    isEmpty = false,
    emptyMessage = "Listelenecek film bulunamadı.",
    emptyIcon
}: MovieGridSectionProps) {
    return (
        <div className="space-y-6 w-full">
            {(title || icon) && (
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-2 text-foreground drop-shadow-md">
                    {icon}
                    {title}
                </h2>
            )}

            {!isEmpty ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {children}
                </div>
            ) : (
                <div className="flex flex-col h-32 md:h-64 items-center justify-center gap-4 bg-muted/30 border border-border rounded-2xl w-full">
                    {emptyIcon || <span className="text-4xl text-white/50">🔍</span>}
                    <p className="text-muted-foreground font-medium text-lg text-center px-4">
                        {emptyMessage}
                    </p>
                </div>
            )}
        </div>
    );
}
