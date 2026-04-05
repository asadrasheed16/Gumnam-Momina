import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{background:'#FFF9F2'}}>

      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute top-16 left-10 w-64 h-64 rounded-full opacity-30 float-anim"
        style={{background:'radial-gradient(circle,rgba(212,118,10,0.15),transparent)'}} />
      <div className="absolute bottom-16 right-10 w-48 h-48 rounded-full opacity-20 float-anim"
        style={{background:'radial-gradient(circle,rgba(26,122,109,0.12),transparent)', animationDelay:'2.5s'}} />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-20 float-anim"
        style={{background:'radial-gradient(circle,rgba(122,46,58,0.10),transparent)', animationDelay:'1.5s'}} />

      <div className="relative text-center max-w-lg">
        <div className="flex justify-center gap-3 mb-6 text-3xl opacity-50">
          <span className="float-anim" style={{animationDelay:'0s', color:'#D4760A'}}>✦</span>
          <span className="float-anim" style={{animationDelay:'0.5s', color:'#7A2E3A'}}>☽</span>
          <span className="float-anim" style={{animationDelay:'1s', color:'#D4760A'}}>✦</span>
        </div>

        <div className="relative mb-6 select-none">
          <p className="font-playfair font-bold leading-none pointer-events-none"
            style={{
              fontSize:'clamp(120px,22vw,200px)',
              fontFamily:'Playfair Display,serif',
              color:'transparent',
              WebkitTextStroke:'2px rgba(212,118,10,0.20)',
              position:'absolute', width:'100%', top:0, left:0,
            }}>
            404
          </p>
          <p className="font-playfair font-bold leading-none text-gold-shimmer"
            style={{
              fontSize:'clamp(120px,22vw,200px)',
              fontFamily:'Playfair Display,serif',
              position:'relative', zIndex:1,
            }}>
            404
          </p>
        </div>

        <p className="mb-4 leading-none text-gold-shimmer"
          style={{fontSize:'clamp(32px,6vw,52px)', fontFamily:'Great Vibes,cursive'}}>
          Oh no, this page got lost!
        </p>

        <div className="candy-divider max-w-40 mx-auto my-6" />

        <p className="mb-3" style={{fontFamily:'Amiri,serif', fontSize:'18px', color:'#B8862C'}}>
          ﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾
        </p>

        <h1 className="font-playfair text-2xl italic mb-3"
          style={{fontFamily:'Playfair Display,serif', color:'#2D1810'}}>
          Page Not Found
        </h1>
        <p className="font-dm text-sm leading-relaxed mb-10 max-w-sm mx-auto" style={{color:'#6B4A3A'}}>
          This page has wandered off somewhere beautiful.
          <br />Let&apos;s guide you back home, insha&apos;Allah. ✦
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary px-10 py-4 rounded-full text-xs tracking-widest">
            Return Home
          </Link>
          <Link href="/products" className="btn-secondary px-10 py-4 rounded-full text-xs tracking-widest">
            View Collection
          </Link>
        </div>

        <div className="flex justify-center gap-3 mt-12 text-2xl" style={{color:'rgba(212,118,10,0.18)'}}>
          <span>✦</span><span>☽</span><span>✦</span>
        </div>
      </div>
    </div>
  );
}
