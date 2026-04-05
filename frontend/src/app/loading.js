export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{background:'#FFF9F2'}}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2"
            style={{borderColor:'rgba(212,118,10,0.18)'}} />
          <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
            style={{borderColor:'rgba(212,118,10,0.45)', borderTopColor:'transparent'}} />
          <div className="absolute inset-2 rounded-full flex items-center justify-center">
            <span className="text-lg animate-bounce" style={{animationDuration:'1.2s', color:'#D4760A'}}>☽</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl leading-none text-gold-shimmer" style={{fontFamily:'Great Vibes,cursive'}}>
            Loading...
          </p>
          <p className="font-dm text-[10px] tracking-[0.3em] uppercase mt-1" style={{color:'#B8862C'}}>
            Please wait ✦
          </p>
        </div>
      </div>
    </div>
  );
}
