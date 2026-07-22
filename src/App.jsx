import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Code2,
  Disc3,
  GraduationCap,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";

const nav = [
  ["目次", "index"],
  ["自己紹介", "about"],
  ["歌手布教", "music"],
  ["本おきば", "books"],
  ["制作物", "works"],
  ["勉強", "study"],
];

const artists = [
  { name: "Artist 01", genre: "Alternative / Pop", note: "夜の散歩に似合う、静けさと熱を持った音楽。", color: "from-violet-500 to-fuchsia-400" },
  { name: "Artist 02", genre: "Rock / Indie", note: "言葉とギターがまっすぐ届く。最初の一曲におすすめ。", color: "from-cyan-400 to-blue-500" },
  { name: "Artist 03", genre: "Electronic", note: "作業中の景色を少しだけ未来に変えてくれる音。", color: "from-amber-300 to-orange-500" },
];

const books = [
  { title: "思考を深める本", author: "著者名", tag: "思考", note: "問いの立て方を変えてくれた一冊。" },
  { title: "世界を見るための本", author: "著者名", tag: "教養", note: "知らない分野への入口として。" },
  { title: "ものづくりの本", author: "著者名", tag: "技術", note: "手を動かす前に読み返したい。" },
  { title: "ことばを味わう本", author: "著者名", tag: "小説", note: "文章の余韻が長く残る作品。" },
];

const works = [
  { no: "01", title: "Personal Archive", kind: "Web Design", desc: "好きなものと学びを静かに蓄積する個人サイト。" },
  { no: "02", title: "Tiny Tool", kind: "Development", desc: "日々の小さな不便を解消するシンプルな道具。" },
  { no: "03", title: "Visual Study", kind: "Experiment", desc: "色・文字・動きを試すためのデザイン習作。" },
];

const study = [
  { subject: "Web", value: 72, text: "HTML / CSS / JavaScript" },
  { subject: "Design", value: 58, text: "UI / Typography / Color" },
  { subject: "English", value: 44, text: "Reading / Vocabulary" },
];

function SectionTitle({ eyebrow, children, sub }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[.24em] text-violet-500 uppercase">
        <span className="h-px w-8 bg-violet-500" />{eyebrow}
      </div>
      <h2 className="text-4xl font-black tracking-[-.04em] md:text-6xl">{children}</h2>
      {sub && <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{sub}</p>}
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const filteredBooks = useMemo(() => books.filter((b) => `${b.title}${b.author}${b.tag}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const jump = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenu(false); };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen overflow-hidden bg-[#f5f3ee] text-neutral-950 transition-colors duration-500 dark:bg-[#0b0b0d] dark:text-[#f4f1eb]">
        <style>{`
          html { scroll-behavior:smooth; }
          ::selection { background:#8b5cf6; color:white; }
          .grain:before { content:""; position:fixed; inset:0; pointer-events:none; z-index:70; opacity:.045; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E"); }
          .glow { background:radial-gradient(360px circle at var(--mx,50%) var(--my,20%), rgba(139,92,246,.12), transparent 72%); }
          .outline-text { color:transparent; -webkit-text-stroke:1px currentColor; opacity:.36; }
        `}</style>
        <motion.div className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-violet-500" style={{ scaleX }} />
        <div className="grain glow fixed inset-0 z-50 pointer-events-none" />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-[#f5f3ee]/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0d]/70">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
            <button onClick={() => jump("top")} className="flex items-center gap-2 font-black tracking-tight"><span className="grid h-7 w-7 place-items-center rounded-full bg-violet-500 text-xs text-white">S</span> SHUSUKE AIBA</button>
            <nav className="hidden items-center gap-7 md:flex">{nav.slice(1).map(([label,id]) => <button key={id} onClick={() => jump(id)} className="text-xs font-semibold text-neutral-500 transition hover:text-violet-500 dark:text-neutral-400">{label}</button>)}</nav>
            <div className="flex items-center gap-2">
              <button aria-label="テーマ切替" onClick={() => setDark(!dark)} className="grid h-9 w-9 place-items-center rounded-full border border-black/10 transition hover:rotate-12 dark:border-white/15">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
              <button aria-label="メニュー" onClick={() => setMenu(!menu)} className="grid h-9 w-9 place-items-center rounded-full border border-black/10 md:hidden dark:border-white/15">{menu ? <X size={17}/> : <Menu size={17}/>}</button>
            </div>
          </div>
        </header>

        <AnimatePresence>{menu && <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="fixed inset-x-4 top-20 z-30 rounded-3xl border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-neutral-900/95">{nav.map(([label,id],i)=><button key={id} onClick={()=>jump(id)} className="flex w-full items-center justify-between rounded-2xl p-4 text-left text-lg font-bold hover:bg-violet-500/10"><span>0{i+1}　{label}</span><ArrowUpRight size={16}/></button>)}</motion.div>}</AnimatePresence>

        <main>
          <section id="top" className="relative flex min-h-screen items-center px-5 pt-24 md:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8}} className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[.25em] text-neutral-500 uppercase"><Sparkles size={14} className="text-violet-500"/> Personal archive / 2026</motion.div>
              <h1 className="max-w-6xl text-[16vw] font-black leading-[.76] tracking-[-.075em] md:text-[10.5rem]">
                CURIOUS<br/><span className="outline-text text-neutral-900 dark:text-white">BY NATURE.</span>
              </h1>
              <div className="mt-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <p className="max-w-md text-base leading-8 text-neutral-600 dark:text-neutral-400">好きな音楽、本、制作、そして学び。<br/>ここは、相場 脩佑の興味が交差する小さなホームページです。</p>
                <button onClick={()=>jump("index")} className="group flex items-center gap-3 text-sm font-bold">EXPLORE <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-500 text-white transition group-hover:translate-y-1"><ChevronDown/></span></button>
              </div>
            </div>
          </section>

          <section id="index" className="border-y border-black/10 px-5 py-24 dark:border-white/10 md:px-8 md:py-32">
            <div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Index" sub="気になる項目から、このサイトを自由に巡ってください。">目次</SectionTitle>
              <div className="grid md:grid-cols-2">{nav.slice(1).map(([label,id],i)=><motion.button whileHover={{x:8}} key={id} onClick={()=>jump(id)} className="group flex items-center justify-between border-t border-black/10 py-7 text-left dark:border-white/10 md:px-5"><span className="flex items-center gap-5"><span className="text-xs text-violet-500">0{i+1}</span><span className="text-2xl font-bold">{label}</span></span><ArrowUpRight className="transition group-hover:rotate-45"/></motion.button>)}</div>
            </div>
          </section>

          <section id="about" className="px-5 py-24 md:px-8 md:py-40"><div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.85fr_1.15fr]">
            <SectionTitle eyebrow="About me">自己紹介</SectionTitle>
            <div><p className="text-3xl font-bold leading-[1.55] tracking-tight md:text-5xl">知らないことを、<span className="text-violet-500">面白がる。</span><br/>小さく作って、確かめる。</p><p className="mt-10 max-w-2xl leading-8 text-neutral-600 dark:text-neutral-400">学生。Web、デザイン、音楽、本に関心があります。この場所では、完成品だけでなく、考えている途中や学んだ痕跡も残していきます。</p><div className="mt-12 flex flex-wrap gap-3">{["Student","Web","Design","Music","Books"].map(x=><span key={x} className="rounded-full border border-black/15 px-4 py-2 text-xs dark:border-white/15">{x}</span>)}</div></div>
          </div></section>

          <section id="music" className="bg-neutral-950 px-5 py-24 text-white md:px-8 md:py-40"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Music guide" sub="音楽との出会い方まで含めて紹介する、個人的な布教スペース。">歌手布教</SectionTitle>
            <div className="grid gap-5 lg:grid-cols-3">{artists.map((a,i)=><motion.button whileHover={{y:-7}} onClick={()=>setNow(i)} key={a.name} className={`relative overflow-hidden rounded-[2rem] border p-7 text-left transition ${now===i?"border-violet-400":"border-white/10"}`}><div className={`mb-16 aspect-square rounded-full bg-gradient-to-br ${a.color} p-3 shadow-2xl`}><motion.div animate={{rotate:now===i?360:0}} transition={{duration:10,repeat:Infinity,ease:"linear"}} className="grid h-full w-full place-items-center rounded-full border border-white/30 bg-black/15"><Disc3 size={56}/></motion.div></div><div className="text-xs tracking-widest text-white/50">{a.genre}</div><h3 className="mt-2 text-2xl font-bold">{a.name}</h3><p className="mt-3 text-sm leading-6 text-white/60">{a.note}</p><div className="mt-6 text-xs font-bold text-violet-300">{now===i?"NOW SELECTED":"SELECT"} →</div></motion.button>)}</div>
          </div></section>

          <section id="books" className="px-5 py-24 md:px-8 md:py-40"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionTitle eyebrow="Bookshelf">本おきば</SectionTitle><label className="mb-12 flex items-center gap-3 rounded-full border border-black/10 px-5 py-3 dark:border-white/15"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="本を検索" className="w-40 bg-transparent text-sm outline-none"/></label></div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-2">{filteredBooks.map((b,i)=><article key={b.title} className="group bg-[#f5f3ee] p-7 transition hover:bg-violet-500 hover:text-white dark:bg-[#0b0b0d]"><div className="flex justify-between"><BookOpen/><span className="rounded-full border border-current px-3 py-1 text-[10px]">{b.tag}</span></div><div className="mt-20 text-xs opacity-50">{b.author}</div><h3 className="mt-2 text-2xl font-black">{b.title}</h3><p className="mt-3 text-sm opacity-60">{b.note}</p></article>)}</div>
          </div></section>

          <section id="works" className="border-y border-black/10 px-5 py-24 dark:border-white/10 md:px-8 md:py-40"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Selected works" sub="制作物が増えたら、画像とGitHubリンクをここに追加できます。">制作物</SectionTitle>
            <div>{works.map(w=><motion.article whileHover={{x:8}} key={w.no} className="group grid gap-4 border-t border-black/10 py-8 dark:border-white/10 md:grid-cols-[80px_1fr_1fr_50px] md:items-center"><div className="text-xs text-violet-500">{w.no}</div><h3 className="text-3xl font-bold">{w.title}</h3><div><div className="text-xs font-bold uppercase tracking-widest text-neutral-400">{w.kind}</div><p className="mt-2 text-sm text-neutral-500">{w.desc}</p></div><div className="grid h-11 w-11 place-items-center rounded-full border border-black/15 transition group-hover:rotate-45 group-hover:bg-violet-500 group-hover:text-white dark:border-white/15"><ArrowUpRight size={18}/></div></motion.article>)}</div>
          </div></section>

          <section id="study" className="px-5 py-24 md:px-8 md:py-40"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2"><div><SectionTitle eyebrow="Learning log" sub="進捗率は習熟度ではなく、自分で決めた今期の学習目標に対する目安です。">勉強</SectionTitle><GraduationCap size={80} strokeWidth={1} className="text-violet-500"/></div><div className="space-y-10">{study.map((s,i)=><div key={s.subject}><div className="mb-3 flex items-end justify-between"><div><h3 className="text-2xl font-bold">{s.subject}</h3><p className="mt-1 text-xs text-neutral-500">{s.text}</p></div><span className="text-sm font-bold">{s.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"><motion.div initial={{width:0}} whileInView={{width:`${s.value}%`}} viewport={{once:true}} transition={{duration:1,delay:i*.15}} className="h-full rounded-full bg-violet-500"/></div></div>)}</div></div></section>
        </main>

        <footer className="bg-violet-500 px-5 py-16 text-white md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end"><div><div className="text-xs font-bold tracking-[.25em]">THANKS FOR VISITING</div><div className="mt-4 text-5xl font-black tracking-tight md:text-7xl">また、どこかで。</div></div><div className="text-xs leading-6 text-white/70">© 2026 SHUSUKE AIBA<br/>Built with curiosity.</div></div></footer>
      </div>
    </div>
  );
}