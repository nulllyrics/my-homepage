import { createElement, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Disc3,
  FileText,
  FolderOpen,
  GraduationCap,
  LockKeyhole,
  LogOut,
  Menu,
  Moon,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Sun,
  X,
} from "lucide-react";

const UNIVERSITY_PASSWORD_HASH =
  "5a653503ea2708e8b01851554b43a6147c24e22cd159d9aa1ba9c3b56fecf87b";

const nav = [
  ["目次", "index"],
  ["自己紹介", "about"],
  ["歌手布教", "music"],
  ["本おきば", "books"],
  ["制作物", "works"],
  ["勉強", "study"],
  ["大学限定", "university"],
];

const artists = [
  {
    name: "なにわ男子",
    genre: "男性アイドル",
    song: "Snap!",
    note: "私が初めてハマった男性アイドルです。",
    url: "https://www.youtube.com/channel/UCDtVdj7sm41Ysg3XSiSUH3w",
    color: "from-white via-neutral-200 to-cyan-100",
    discColor: "text-neutral-800",
  },
  {
    name: "OCHA NORMA",
    genre: "女性アイドル",
    song: "女の愛想は武器じゃない",
    note: "かっこいい女性、良いと思います。",
    url: "https://www.youtube.com/channel/UCEbxO0RPlOQIVWrDaeepvuA",
    color: "from-neutral-950 via-neutral-800 to-neutral-600",
    discColor: "text-white",
  },
  {
    name: "Acid Black Cherry",
    genre: "邦ロック",
    song: "この青空の向こうに",
    note: "大好きなロックバンド。声が良すぎる。",
    url: "https://www.youtube.com/channel/UCvf8AMvacJFesdh2hY5b97g",
    color: "from-[#470d1b] via-[#800020] to-[#b4264a]",
    discColor: "text-white",
  },
];

const books = [
  {
    title: "現代認識論入門",
    author: "上枝美典",
    tag: "学習",
    status: "第6章",
    note: "ほんまにむずい。研究用。",
  },
  {
    title: "達成としての知識",
    author: "上枝美典",
    tag: "学習",
    status: "未読",
    note: "早く読みたい。",
  },
  {
    title: "物理学の哲学入門Ⅰ",
    author: "ティム・モードリン",
    tag: "哲学",
    status: "読みたい",
    note: "哲学＋科学。",
  },
  {
    title: "ことばと思考",
    author: "今井むつみ",
    tag: "言語学",
    status: "読了",
    note: "今井むつみの名著。",
  },
];

const works = [
  {
    no: "01",
    title: "Personal Archive",
    kind: "Web Design",
    desc: "好きなものと学びを蓄積する、このホームページ。",
    url: "https://nulllyrics.github.io/my-homepage/",
  },
  {
    no: "02",
    title: "Coming Soon",
    kind: "Development",
    desc: "新しい制作物を追加する予定です。",
    url: "",
  },
  {
    no: "03",
    title: "Coming Soon",
    kind: "Experiment",
    desc: "実験や習作を追加する予定です。",
    url: "",
  },
];

const study = [
  { subject: "位相", value: 62, text: "大学数学" },
  { subject: "Web", value: 28, text: "HTML / CSS / JavaScript / React" },
  { subject: "Music", value: 22, text: "音楽鑑賞・知識の記録" },
];

/*
  OneDriveの共有リンクは、該当するfiles配列へ追加します。

  例:
  files: [
    {
      title: "認識論ゼミ資料",
      description: "大学アカウントでのログインが必要です。",
      url: "ここにOneDriveの共有リンク",
    },
  ],
*/
const universityItems = [
  {
    title: "ホモロジー",
    desc: "ホモロジー群の計算問題と学習記録。",
    icon: FileText,
    files: [
      {
        title: "ホモロジー群の計算 精選100問",
        description: "OneDrive上のWord文書を開きます。",
        url: "https://akitacitm-my.sharepoint.com/:w:/r/personal/s1524201_s_akita-u_ac_jp/Documents/homology.docx?d=w93e158a1661643b291ab24aea7e265db&csf=1&web=1&e=CIFYQu",
      },
    ],
  },
  {
    title: "ゼミ資料",
    desc: "ゼミ発表用PDFや配布資料。",
    icon: Presentation,
    files: [
      {
        title: "ゼミ資料",
        description: "ゼミ発表用PDFや配布資料。",
        url: `${import.meta.env.BASE_URL}works/pdf/works/Lepper_et_al_1973_notebooklm.pptx`,
        href: "works/pdf/works/Lepper_et_al_1973_notebooklm.pptx",
      },
    ],
  },
  {
    title: "学習PDF",
    desc: "学習用にまとめたPDF。",
    icon: FileText,
    files: [],
  },
  {
    title: "メモ",
    desc: "学習・研究の短い記録。",
    icon: StickyNote,
    files: [],
  },
  {
    title: "制作物",
    desc: "大学に関連する制作物。",
    icon: FolderOpen,
    files: [],
  },
];

const researchInterests = [
  "理科教育",
  "教育心理学",
  "倫理学",
  "数学",
  "論理学",
  "哲学",
];

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function ExternalLink({ href, className = "", children }) {
  return createElement(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className,
    },
    children,
  );
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function SectionTitle({ eyebrow, children, sub = "" }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.24em] text-teal-400">
        <span className="h-px w-8 bg-teal-400" />
        {eyebrow}
      </div>

      <h2 className="text-4xl font-black tracking-[-.04em] md:text-6xl">
        {children}
      </h2>

      {sub && (
        <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
          {sub}
        </p>
      )}
    </div>
  );
}

SectionTitle.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sub: PropTypes.string,
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(0);
  const [universityUnlocked, setUniversityUnlocked] = useState(
    () => sessionStorage.getItem("university-unlocked") === "true",
  );
  const [universityPassword, setUniversityPassword] = useState("");
  const [universityError, setUniversityError] = useState("");
  const [universityLoading, setUniversityLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const moveCursorLight = (event) => {
      document.documentElement.style.setProperty(
        "--mx",
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        "--my",
        `${event.clientY}px`,
      );
    };

    window.addEventListener("pointermove", moveCursorLight);
    return () => window.removeEventListener("pointermove", moveCursorLight);
  }, []);

  useEffect(() => {
    const closeMenuWithEscape = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
      }
    };

    window.addEventListener("keydown", closeMenuWithEscape);
    return () => window.removeEventListener("keydown", closeMenuWithEscape);
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) =>
      [book.title, book.author, book.tag, book.status, book.note]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  const jump = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const unlockUniversity = async (event) => {
    event.preventDefault();
    setUniversityLoading(true);
    setUniversityError("");

    try {
      const inputHash = await sha256(universityPassword.trim());

      if (inputHash === UNIVERSITY_PASSWORD_HASH) {
        sessionStorage.setItem("university-unlocked", "true");
        setUniversityUnlocked(true);
        setUniversityPassword("");
      } else {
        setUniversityError("答えが違います。もう一度確認してください。");
      }
    } catch {
      setUniversityError(
        "認証処理に失敗しました。ブラウザを更新してください。",
      );
    } finally {
      setUniversityLoading(false);
    }
  };

  const lockUniversity = () => {
    sessionStorage.removeItem("university-unlocked");
    setUniversityUnlocked(false);
    setUniversityPassword("");
    setUniversityError("");
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen overflow-hidden bg-[#f1f5f3] text-neutral-950 transition-colors duration-500 dark:bg-[#080d10] dark:text-[#edfdf9]">
        <style>{`
          html { scroll-behavior: smooth; }
          ::selection { color: #04110f; background: #2dd4bf; }
          .grain::before {
            content: "";
            position: fixed;
            inset: 0;
            z-index: 70;
            pointer-events: none;
            opacity: .045;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
          }
          .glow {
            background: radial-gradient(
              360px circle at var(--mx, 50%) var(--my, 20%),
              rgba(45, 212, 191, .16),
              transparent 72%
            );
          }
          .outline-text {
            color: transparent;
            -webkit-text-stroke: 1px currentColor;
            opacity: .4;
          }
        `}</style>

        <motion.div
          className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-teal-400 to-cyan-300"
          style={{ scaleX }}
        />

        <div className="grain glow pointer-events-none fixed inset-0 z-50" />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-[#f1f5f3]/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#080d10]/75">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
            <button
              type="button"
              onClick={() => jump("top")}
              className="flex items-center gap-2 font-black tracking-tight"
              aria-label="ページ最上部へ移動"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-400 text-xs text-[#04110f] shadow-[0_0_24px_rgba(45,212,191,.35)]">
                S
              </span>
              <span>SHUYU AIBA</span>
            </button>

            <nav
              className="hidden items-center gap-6 md:flex"
              aria-label="メインナビゲーション"
            >
              {nav.slice(1).map(([label, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => jump(id)}
                  className="text-xs font-semibold text-neutral-500 transition hover:text-teal-500 dark:text-neutral-400 dark:hover:text-teal-300"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={
                  dark
                    ? "ライトモードに切り替える"
                    : "ダークモードに切り替える"
                }
                onClick={() => setDark((value) => !value)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 transition hover:rotate-12 hover:border-teal-400 dark:border-white/15"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                type="button"
                aria-label={menu ? "メニューを閉じる" : "メニューを開く"}
                aria-expanded={menu}
                onClick={() => setMenu((value) => !value)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 md:hidden dark:border-white/15"
              >
                {menu ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="fixed inset-x-4 top-20 z-[60] rounded-3xl border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-neutral-900/95"
            >
              {nav.map(([label, id], index) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => jump(id)}
                  className="flex w-full items-center justify-between rounded-2xl p-4 text-left text-lg font-bold transition hover:bg-teal-400/10"
                >
                  <span>
                    0{index + 1}　{label}
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          <section
            id="top"
            className="relative flex min-h-screen items-center px-5 pt-24 md:px-8"
          >
            <div className="mx-auto w-full max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[.25em] text-neutral-500">
                  <Sparkles size={14} className="text-teal-400" />
                  Personal archive / 2026
                </div>

                <p className="mb-5 text-sm font-semibold uppercase tracking-[.3em] text-teal-500 dark:text-teal-300">
                  Shuyu AIBA / University Student
                </p>

                <h1 className="max-w-6xl text-[15vw] font-black leading-[.82] tracking-[-.075em] md:text-[9rem]">
                  全知に、
                  <br />
                  <span className="outline-text text-neutral-900 dark:text-white">
                    近づきたい。
                  </span>
                </h1>
              </motion.div>

              <div className="mt-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <p className="max-w-md text-base leading-8 text-neutral-600 dark:text-neutral-400">
                  音楽、数学、ゲーム、読書、制作。
                  <br />
                  相場脩佑の興味と学びを集積する個人ホームページです。
                </p>

                <button
                  type="button"
                  onClick={() => jump("index")}
                  className="group flex items-center gap-3 text-sm font-bold"
                >
                  見てみる
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-400 text-[#04110f] shadow-[0_0_30px_rgba(45,212,191,.25)] transition group-hover:translate-y-1">
                    <ChevronDown />
                  </span>
                </button>
              </div>
            </div>
          </section>

          <section
            id="index"
            className="border-y border-black/10 px-5 py-24 dark:border-white/10 md:px-8 md:py-32"
          >
            <div className="mx-auto max-w-7xl">
              <SectionTitle
                eyebrow="Index"
                sub="気になる項目から、このサイトを自由に巡ってください。"
              >
                目次
              </SectionTitle>

              <div className="grid md:grid-cols-2">
                {nav.slice(1).map(([label, id], index) => (
                  <motion.button
                    type="button"
                    whileHover={{ x: 8 }}
                    key={id}
                    onClick={() => jump(id)}
                    className="group flex items-center justify-between border-t border-black/10 py-7 text-left dark:border-white/10 md:px-5"
                  >
                    <span className="flex items-center gap-5">
                      <span className="text-xs text-teal-500 dark:text-teal-300">
                        0{index + 1}
                      </span>
                      <span className="text-2xl font-bold">{label}</span>
                    </span>
                    <ArrowUpRight className="transition group-hover:rotate-45 group-hover:text-teal-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="px-5 py-24 md:px-8 md:py-40">
            <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.85fr_1.15fr]">
              <SectionTitle eyebrow="About me">自己紹介</SectionTitle>

              <div>
                <p className="text-3xl font-bold leading-[1.55] tracking-tight md:text-5xl">
                  全知にはなれなくても、
                  <br />
                  <span className="text-teal-500 dark:text-teal-300">
                    昨日より多くを知りたい。
                  </span>
                </p>

                <p className="mt-10 max-w-2xl leading-8 text-neutral-600 dark:text-neutral-400">
                  こんにちは。相場脩佑です。
                  <br />
                  大学生として学びながら、音楽、数学、ゲームを中心に、興味を持ったことに触れています。このサイトには、好きなものや制作物、勉強の記録を残していきます。
                </p>

                <div className="mt-12 flex flex-wrap gap-3">
                  {["University Student", "Music", "Mathematics", "Games"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/15 px-4 py-2 text-xs transition hover:border-teal-400 hover:bg-teal-400/10 dark:border-white/15"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            id="music"
            className="bg-neutral-950 px-5 py-24 text-white md:px-8 md:py-40"
          >
            <div className="mx-auto max-w-7xl">
              <SectionTitle
                eyebrow="Music guide"
                sub="個人的におすすめしたいアーティストと、最初に聴いてほしい一曲を紹介します。"
              >
                歌手布教
              </SectionTitle>

              <div className="grid gap-5 lg:grid-cols-3">
                {artists.map((artist, index) => (
                  <motion.article
                    key={artist.name}
                    whileHover={{ y: -7 }}
                    className={`relative overflow-hidden rounded-[2rem] border p-7 text-left transition ${
                      selectedArtist === index
                        ? "border-teal-300 bg-teal-300/5 shadow-[0_0_45px_rgba(45,212,191,.12)]"
                        : "border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedArtist(index)}
                      className="block w-full text-left"
                      aria-label={`${artist.name}を選択`}
                    >
                      <div
                        className={`mb-12 aspect-square rounded-full bg-gradient-to-br ${artist.color} p-3 shadow-2xl`}
                      >
                        <motion.div
                          animate={{
                            rotate: selectedArtist === index ? 360 : 0,
                          }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className={`grid h-full w-full place-items-center rounded-full border border-white/30 bg-black/10 ${artist.discColor}`}
                        >
                          <Disc3 size={56} />
                        </motion.div>
                      </div>

                      <div className="text-xs tracking-widest text-white/50">
                        {artist.genre}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold">{artist.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/60">
                        {artist.note}
                      </p>
                      <div className="mt-6 text-xs font-bold text-teal-200">
                        {selectedArtist === index ? "NOW SELECTED" : "SELECT"} →
                      </div>
                    </button>

                    <div className="mt-7 border-t border-white/10 pt-5">
                      <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/40">
                        Recommended song
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <p className="font-bold text-white">{artist.song}</p>
                        <ExternalLink
                          href={artist.url}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 transition hover:border-teal-300 hover:bg-teal-300 hover:text-neutral-950"
                        >
                          <ArrowUpRight size={17} />
                        </ExternalLink>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section id="books" className="px-5 py-24 md:px-8 md:py-40">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <SectionTitle
                  eyebrow="Bookshelf"
                  sub="読んだ本、読んでいる本、これから読みたい本を置いていきます。"
                >
                  本おきば
                </SectionTitle>

                <label className="mb-12 flex items-center gap-3 rounded-full border border-black/10 px-5 py-3 transition focus-within:border-teal-400 dark:border-white/15">
                  <Search size={16} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="本を検索"
                    aria-label="本を検索"
                    className="w-40 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  />
                </label>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-2">
                  {filteredBooks.map((book) => (
                    <article
                      key={book.title}
                      className="group bg-[#f1f5f3] p-7 transition hover:bg-teal-400 hover:text-[#04110f] dark:bg-[#080d10]"
                    >
                      <div className="flex justify-between gap-4">
                        <BookOpen />
                        <div className="flex flex-wrap justify-end gap-2">
                          <span className="rounded-full border border-current px-3 py-1 text-[10px]">
                            {book.tag}
                          </span>
                          <span className="rounded-full border border-current px-3 py-1 text-[10px]">
                            {book.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-20 text-xs opacity-50">
                        {book.author}
                      </div>
                      <h3 className="mt-2 text-2xl font-black">{book.title}</h3>
                      <p className="mt-3 text-sm opacity-60">{book.note}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-black/15 px-6 py-16 text-center text-sm text-neutral-500 dark:border-white/15 dark:text-neutral-400">
                  「{query}」に一致する本はありません。
                </div>
              )}
            </div>
          </section>

          <section
            id="works"
            className="border-y border-black/10 px-5 py-24 dark:border-white/10 md:px-8 md:py-40"
          >
            <div className="mx-auto max-w-7xl">
              <SectionTitle
                eyebrow="Selected works"
                sub="制作物や実験したものを、少しずつここへ追加していきます。"
              >
                制作物
              </SectionTitle>

              <div>
                {works.map((work) => {
                  const content = (
                    <>
                      <div className="text-xs text-teal-500 dark:text-teal-300">
                        {work.no}
                      </div>
                      <h3 className="text-3xl font-bold">{work.title}</h3>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                          {work.kind}
                        </div>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                          {work.desc}
                        </p>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-full border border-black/15 transition group-hover:rotate-45 group-hover:border-teal-400 group-hover:bg-teal-400 group-hover:text-[#04110f] dark:border-white/15">
                        <ArrowUpRight size={18} />
                      </div>
                    </>
                  );

                  const linkClass =
                    "group grid gap-4 border-t border-black/10 py-8 transition hover:translate-x-2 dark:border-white/10 md:grid-cols-[80px_1fr_1fr_50px] md:items-center";

                  if (work.url) {
                    return (
                      <ExternalLink
                        key={work.no}
                        href={work.url}
                        className={linkClass}
                      >
                        {content}
                      </ExternalLink>
                    );
                  }

                  return (
                    <article
                      key={work.no}
                      className={`${linkClass} opacity-60`}
                    >
                      {content}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="study" className="px-5 py-24 md:px-8 md:py-40">
            <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
              <div>
                <SectionTitle
                  eyebrow="Learning log"
                  sub="進捗率は習熟度ではなく、自分で決めた学習目標に対する現在地の目安です。"
                >
                  勉強
                </SectionTitle>
                <GraduationCap
                  size={80}
                  strokeWidth={1}
                  className="text-teal-400"
                />
              </div>

              <div className="space-y-10">
                {study.map((item, index) => (
                  <div key={item.subject}>
                    <div className="mb-3 flex items-end justify-between gap-5">
                      <div>
                        <h3 className="text-2xl font-bold">{item.subject}</h3>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {item.text}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-300">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-300 shadow-[0_0_18px_rgba(45,212,191,.45)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="university"
            className="relative overflow-hidden bg-teal-400 px-5 py-24 text-black md:px-8 md:py-40"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(0,0,0,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.16)_1px,transparent_1px)] [background-size:36px_36px]" />
            <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border border-black/20 shadow-[0_0_100px_rgba(0,0,0,.22)]" />

            <div className="relative mx-auto max-w-7xl">
              <div className="mb-10 flex items-start justify-between gap-6">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.3em]">
                    <span className="h-px w-8 bg-black" />
                    Restricted campus node
                  </div>
                  <h2 className="text-4xl font-black tracking-[-.05em] md:text-7xl">
                    大学限定
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-black/65">
                    大学での学習や研究の記録を置いています。
                  </p>
                </div>

                {universityUnlocked && (
                  <button
                    type="button"
                    onClick={lockUniversity}
                    className="flex shrink-0 items-center gap-2 border border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition hover:bg-black hover:text-teal-300"
                  >
                    <LogOut size={15} />
                    退出する
                  </button>
                )}
              </div>

              {!universityUnlocked ? (
                <div className="grid gap-8 border border-black bg-black p-6 text-teal-300 shadow-[12px_12px_0_rgba(0,0,0,.25)] md:grid-cols-[.8fr_1.2fr] md:p-10">
                  <div className="border-b border-teal-300/30 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
                    <LockKeyhole size={58} strokeWidth={1.3} />
                    <div className="mt-8 font-mono text-xs uppercase tracking-[.25em] text-teal-300/55">
                      Authorization required
                    </div>
                    <p className="mt-4 text-2xl font-black leading-snug">
                      この領域へのアクセスには認証が必要です。
                    </p>
                  </div>

                  <form
                    onSubmit={unlockUniversity}
                    className="flex flex-col justify-center"
                  >
                    <label
                      htmlFor="university-password"
                      className="text-sm font-black"
                    >
                      私の学籍番号は？
                    </label>
                    <input
                      id="university-password"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      value={universityPassword}
                      onChange={(event) => {
                        setUniversityPassword(event.target.value);
                        setUniversityError("");
                      }}
                      className="mt-4 border border-teal-300/50 bg-transparent px-4 py-4 font-mono text-lg tracking-[.3em] text-teal-200 outline-none transition placeholder:text-teal-300/20 focus:border-teal-200 focus:shadow-[0_0_24px_rgba(45,212,191,.22)]"
                      placeholder="•••••••"
                      aria-describedby={
                        universityError ? "university-error" : undefined
                      }
                    />

                    {universityError && (
                      <p
                        id="university-error"
                        role="alert"
                        className="mt-3 text-sm text-red-300"
                      >
                        {universityError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={
                        universityLoading || !universityPassword.trim()
                      }
                      className="mt-5 flex items-center justify-center gap-2 bg-teal-300 px-5 py-4 text-sm font-black uppercase tracking-[.2em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ShieldCheck size={18} />
                      {universityLoading ? "認証中..." : "認証して入室"}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-black bg-black p-6 text-teal-300 shadow-[12px_12px_0_rgba(0,0,0,.25)] md:p-10"
                >
                  <div className="flex items-center gap-3 border-b border-teal-300/25 pb-6">
                    <ShieldCheck size={24} />
                    <p className="text-xl font-black">
                      ようこそ、いろいろ置いとくね
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {universityItems.map((item) => {
                      const Icon = item.icon;
                      const files = Array.isArray(item.files)
                        ? item.files.filter(
                            (file) =>
                              file && typeof file.url === "string" &&
                              file.url.trim() !== ""
                          )
                        : [];
                      return (
                      <article key={item.title} className="border border-teal-300/25 p-5">
                        {Icon ? (
                          <Icon size={25} aria-hidden="true" />
                        ) : (
                        <FileText size={25} aria-hidden="true" />
                        )}

                        <h3 className="mt-10 text-xl font-black">
                          {item.title}
                        </h3>
                        
                        <p className="mt-2 text-sm leading-6 opacity-65">
                          {item.desc}
                        </p>
                        {files.length > 0 ? (
                          <>
                            <div className="mt-6 space-y-3">
                              {files.map((file, fileIndex) => (
                                <ExternalLink
                                  key={fileIndex}
                                  href={file.url}
                                  className="group/file block rounded-md border border-teal-300/20 px-4 py-3"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <div className="font-bold">
                                        {file.title || "資料を開く"}
                                      </div>

                                      {file.description && (
                                        <p className="mt-1 text-xs leading-5 opacity-60">
                                          {file.description}
                                        </p>
                                      )}
                                    </div>

                                    <ArrowUpRight
                                      size={17}
                                      className="shrink-0 transition group-hover/file:rotate-45"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </ExternalLink>
                              ))}
                            </div>
                            <div className="mt-3 font-mono text-[10px] uppercase tracking-[.2em] opacity-50">
                              Open secure file
                            </div>
                          </>
                        ) : (
                          <div className="mt-5 text-[10px] font-black uppercase tracking-[.22em] opacity-50">
                            OneDrive link not registered
                          </div>)}
                      </article>
                      );
                    })}
                  </div>

                  <div className="mt-8 border border-teal-300/25 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[.25em] text-teal-300/55">
                      Research interests
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {researchInterests.map((interest) => (
                        <span
                          key={interest}
                          className="border border-teal-300/30 px-3 py-2 text-xs font-bold"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-xs leading-6 text-teal-300/55">
                    各資料はOneDriveまたはSharePoint側でもアクセス権が確認されます。
                  </p>
                </motion.div>
              )}
            </div>
          </section>
        </main>

        <footer className="bg-teal-400 px-5 py-16 text-[#04110f] md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.25em]">
                Thanks for visiting
              </div>
              <div className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
                また、どこかで。
              </div>
            </div>

            <div className="flex flex-col items-start gap-5 md:items-end">
              <ExternalLink
                href="https://github.com/nulllyrics"
                className="flex items-center gap-2 rounded-full border border-[#04110f]/20 px-4 py-2 text-xs font-bold transition hover:bg-[#04110f] hover:text-teal-300"
              >
                GitHub
                <ArrowUpRight size={14} />
              </ExternalLink>

              <div className="text-xs leading-6 opacity-70 md:text-right">
                © 2026 SHUYU AIBA
                <br />
                Approaching omniscience.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
