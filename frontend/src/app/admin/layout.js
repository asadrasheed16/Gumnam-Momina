'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiHome, FiShoppingBag, FiUsers, FiBarChart2 } from 'react-icons/fi';

const adminLinks = [
  { href:'/admin',          label:'Dashboard', icon:FiBarChart2, emoji:'📊' },
  { href:'/admin/products', label:'Products',  icon:FiGrid,      emoji:'🧕' },
  { href:'/admin/orders',   label:'Orders',    icon:FiPackage,   emoji:'📦' },
  { href:'/admin/users',    label:'Users',     icon:FiUsers,     emoji:'👥' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{background:'#FFF9F2'}}>

      {/* Sidebar — desktop */}
      <aside className="w-56 flex-shrink-0 border-r pt-8 px-4 hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto"
        style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>

        <Link href="/" className="block text-center mb-6 pb-6 border-b" style={{borderColor:'rgba(212,118,10,0.12)'}}>
          <p className="text-rose-400 text-2xl leading-none" style={{fontFamily:'Amiri,serif', color:'#A85A62'}}>
            گمنام مومنہ
          </p>
          <p className="font-dm text-[9px] tracking-[0.25em] uppercase mt-1" style={{color:'#B8862C'}}>
            Admin Panel
          </p>
        </Link>

        <p className="font-dm text-[9px] tracking-[0.3em] uppercase px-3 mb-3 font-medium" style={{color:'#B8862C'}}>
          Manage
        </p>

        <nav className="space-y-1 flex-1">
          {adminLinks.map(({ href, label, icon:Icon, emoji }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-dm font-medium tracking-wide uppercase transition-all"
                style={active
                  ? {background:'linear-gradient(135deg,#FFF5EC,#FFCCD6)', color:'#D4760A', boxShadow:'0 2px 12px rgba(201,79,109,0.15)'}
                  : {color:'rgba(61,43,53,0.45)'}
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.background='#FFF5EC'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent'; }}
              >
                <span className="text-base">{emoji}</span>
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="pb-6 pt-4 border-t space-y-1" style={{borderColor:'rgba(212,118,10,0.12)'}}>
          <Link href="/products"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-dm font-medium tracking-wide uppercase transition-colors"
            style={{color:'rgba(61,43,53,0.4)'}}
            onMouseEnter={e => e.currentTarget.style.background='#FFF5EC'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <FiShoppingBag size={13} /> View Store
          </Link>
          <Link href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-dm font-medium tracking-wide uppercase transition-colors"
            style={{color:'rgba(61,43,53,0.4)'}}
            onMouseEnter={e => e.currentTarget.style.background='#FFF5EC'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <FiHome size={13} /> Homepage
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t flex md:hidden shadow-petal"
        style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
        {adminLinks.map(({ href, label, icon:Icon, emoji }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-dm font-medium tracking-widest uppercase transition-colors"
              style={active ? {color:'#D4760A'} : {color:'rgba(61,43,53,0.4)'}}>
              <span className="text-lg">{emoji}</span>
              {label}
            </Link>
          );
        })}
        <Link href="/"
          className="flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-dm font-medium tracking-widest uppercase"
          style={{color:'rgba(61,43,53,0.4)'}}>
          <FiHome size={18} />
          Home
        </Link>
      </div>

      <div className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
