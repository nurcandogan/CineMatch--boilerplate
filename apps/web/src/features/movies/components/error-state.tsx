import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = "Şu anda filmleri getirirken bir hata oluştu, lütfen daha sonra tekrar deneyin.",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-64 w-full gap-4 text-center px-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-muted-foreground font-medium text-lg max-w-md text-red-500/80">
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 mt-4 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors rounded-full font-semibold backdrop-blur-sm border border-red-500/20"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Tekrar Dene
                </button>
            )}
        </div>
    );
}
