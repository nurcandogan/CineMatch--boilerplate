import { GenreRow } from '../components/genre-row';
import { MovieDetailsModal } from '../components/movie-details-modal';

const MOVIE_GENRES = [
    { title: 'Aksiyon Filmleri', id: 28 },
    { title: 'Bilim Kurgu Filmleri', id: 878 },
    { title: 'Komedi Filmleri', id: 35 },
    { title: 'Korku Filmleri', id: 27 },
    { title: 'Romantik Filmler', id: 10749 },
    { title: 'Animasyonlar', id: 16 },
    { title: 'Fantastik Serüvenler', id: 14 }
];

export function MoviesPage() {
    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">
            {/* MOVIES HEADER */}
            <div className="px-2 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Tüm Filmler</h1>
                <p className="text-sm font-medium text-muted-foreground">İstediğin türdeki filmleri türlerine göre keşfet.</p>
            </div>

            {/* GENRE ROWS */}
            <div className="space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500 pt-12">
                {MOVIE_GENRES.map((genre) => (
                    <GenreRow key={genre.id} title={genre.title} genreId={genre.id} />
                ))}
            </div>

            <MovieDetailsModal />
        </div>
    );
}
