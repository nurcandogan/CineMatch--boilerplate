import { Ghost, Heart, Zap, Cloud, Coffee, Lightbulb, PartyPopper, Smile } from 'lucide-react';

export const MOODS = [
    { id: 'keyifli', label: 'Keyifli', icon: Smile, color: 'from-orange-400 to-yellow-400' },
    { id: 'heyecanli', label: 'Heyecanlı', icon: Zap, color: 'from-red-500 to-rose-600' },
    { id: 'romantik', label: 'Romantik', icon: Heart, color: 'from-pink-500 to-rose-400' },
    { id: 'melankolik', label: 'Melankolik', icon: Cloud, color: 'from-purple-500 to-indigo-500' },
    { id: 'gizemli', label: 'Gizemli', icon: Ghost, color: 'from-indigo-600 to-blue-700' },
    { id: 'sakin', label: 'Sakin', icon: Coffee, color: 'from-teal-400 to-emerald-500' },
    { id: 'eglenceli', label: 'Eğlenceli', icon: PartyPopper, color: 'from-yellow-400 to-orange-500' },
    { id: 'zihin_acici', label: 'Zihin Açıcı', icon: Lightbulb, color: 'from-blue-400 to-cyan-500' },
];

export const MOVIE_GENRES = [
    { title: 'Aksiyon Filmleri', id: 28 },
    { title: 'Bilim Kurgu Filmleri', id: 878 },
    { title: 'Komedi Filmleri', id: 35 },
    { title: 'Korku Filmleri', id: 27 },
    { title: 'Romantik Filmler', id: 10749 },
    { title: 'Animasyonlar', id: 16 },
    { title: 'Fantastik Serüvenler', id: 14 }
];
