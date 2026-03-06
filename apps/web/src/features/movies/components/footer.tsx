import { Github, Twitter, Instagram, Film } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '#/lib/tmdb';

export function Footer() {
    return (
        <footer className="w-full mt-24 mb-16 lg:mb-0 border-t border-border/10 bg-background/40 backdrop-blur-xl relative overflow-hidden z-10 transition-colors duration-300">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

            <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-16 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <span className="font-black text-3xl tracking-tighter text-red-600 select-none flex items-center gap-2">
                            <Film className="w-8 h-8 text-red-600" />
                            CineMatch
                        </span>
                        <p className="text-sm text-muted-foreground/80 max-w-sm leading-relaxed">
                            CineMatch ile aradığın filmi saniyeler içinde bul, listene ekle ve puanla. Film deneyimini yeni bir seviyeye taşı.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-bold text-sm tracking-widest uppercase">Keşfet</h4>
                        <nav className="flex flex-col gap-2.5">
                            <a href="#" className="text-sm text-muted-foreground hover:text-red-500 transition-colors w-fit">Hakkımızda</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-red-500 transition-colors w-fit">Gizlilik Politikası</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-red-500 transition-colors w-fit">Kullanım Koşulları</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-red-500 transition-colors w-fit">İletişim</a>
                        </nav>
                    </div>

                    {/* Social & TMDB Badge */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-foreground font-bold text-sm tracking-widest uppercase">Bizi Takip Et</h4>
                            <div className="flex gap-4">
                                <a href="#" className="bg-white/5 p-2 rounded-full text-foreground hover:bg-red-600 hover:text-white transition-all hover:scale-110">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="bg-white/5 p-2 rounded-full text-foreground hover:bg-red-600 hover:text-white transition-all hover:scale-110">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="bg-white/5 p-2 rounded-full text-foreground hover:bg-red-600 hover:text-white transition-all hover:scale-110">
                                    <Github className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* TMDB Attribution */}
                        <div className="pt-2">
                            <img
                                src={`${TMDB_IMAGE_BASE_URL.replace('/t/p', '')}/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg`}
                                alt="TMDB Logo"
                                className="h-4 opacity-50 hover:opacity-100 transition-opacity"
                            />
                            <p className="text-[10px] text-muted-foreground/60 mt-2 leading-tight">
                                This product uses the TMDB API but is not endorsed or certified by TMDB.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground/60">
                        &copy; {new Date().getFullYear()} CineMatch. Tüm hakları saklıdır.
                    </p>
                    <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
                        Made with <span className="text-red-500">♥</span> for movie lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
