export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <main className="text-center px-6 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          MIZMIZ
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Topluluk deneyimini yeniden keşfet
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/register"
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Hemen Başla
          </a>
          <a
            href="/login"
            className="px-8 py-4 bg-background border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all hover:scale-105"
          >
            Giriş Yap
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">İçerik Paylaş</h3>
            <p className="text-muted-foreground">
              Düşüncelerini, fotoğraflarını ve deneyimlerini toplulukla paylaş
            </p>
          </div>

          <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Bağlantı Kur</h3>
            <p className="text-muted-foreground">
              İlgi alanlarına uygun kişileri keşfet ve takip et
            </p>
          </div>

          <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Etkileşim</h3>
            <p className="text-muted-foreground">
              Beğen, yorum yap ve anlamlı konuşmalar başlat
            </p>
          </div>
        </div>

        <div className="mt-16 text-sm text-muted-foreground">
          <p>Versiyon 0.1.0 (MVP) • 2025</p>
        </div>
      </main>
    </div>
  );
}
