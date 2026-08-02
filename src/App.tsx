import {
  ArrowDown,
  Disc3,
  Headphones,
  LockKeyhole,
  Mail,
  Mic2,
  Music2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent, RefObject } from "react";
import { abilities } from "./data/abilities";
import { adminAccess, adminModules } from "./data/admin";
import { artists, musicDna } from "./data/artists";
import { profile } from "./data/profile";
import { qqImportedPlaylist } from "./data/qqImportedPlaylist";
import { qqMusicSync } from "./data/qqMusic";
import { Song, songs } from "./data/songs";

const LiquidEther = lazy(() => import("./components/LiquidEther"));
const MagicRings = lazy(() => import("./components/MagicRings"));

const navItems = [
  ["首页", "home"],
  ["音乐人格", "dna"],
  ["KTV歌单", "songs"],
  ["QQ音乐", "qq-music"],
  ["私人后台", "admin"],
  ["联系我", "contact"],
];

function useDesignerMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const scope = root;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    async function setupMotion() {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
      const opening = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      opening
        .set(".opening-mask", { scaleX: 1, transformOrigin: "left center" })
        .fromTo(
          ".nav-shell",
          { y: -72, autoAlpha: 0, filter: "blur(16px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05 },
          0.12,
        )
        .fromTo(
          ".hero-kicker",
          { clipPath: "inset(0 100% 0 0)", y: 18, autoAlpha: 0 },
          { clipPath: "inset(0 0% 0 0)", y: 0, autoAlpha: 1, duration: 0.95 },
          0.35,
        )
        .fromTo(
          ".hero-title-line",
          {
            y: 136,
            scaleY: 0.72,
            rotateX: -22,
            autoAlpha: 0,
            filter: "blur(18px)",
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            scaleY: 1,
            rotateX: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.45,
            stagger: 0.16,
          },
          0.58,
        )
        .fromTo(
          ".hero-subtitle, .hero-actions",
          { y: 42, autoAlpha: 0, filter: "blur(10px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05, stagger: 0.12 },
          1.08,
        )
        .fromTo(
          ".hero-portrait",
          { clipPath: "inset(0 0 100% 0)", y: 82, scale: 1.08, filter: "blur(12px)" },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.35,
            ease: "expo.out",
          },
          0.78,
        )
        .to(".opening-mask", { scaleX: 0, duration: 1.28, ease: "expo.inOut" }, 0.02);

      gsap.to(".hero-video-layer", {
        scale: 1.08,
        autoAlpha: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".dopamine-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>(".designer-section").forEach((section) => {
        const giant = section.querySelector(".section-giant-title");
        const eyebrow = section.querySelector(".section-eyebrow");
        const title = section.querySelector(".section-title");
        const description = section.querySelector(".section-description");
        const cards = section.querySelectorAll("[data-card]");
        const images = section.querySelectorAll("[data-reveal-image]");
        const parallaxItems = section.querySelectorAll("[data-parallax]");

        if (giant) {
          gsap.fromTo(
            giant,
            { y: 130, scale: 0.84, autoAlpha: 0, filter: "blur(16px)" },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 1.25,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 76%",
                once: true,
              },
            },
          );
        }

        gsap.fromTo(
          [eyebrow, title, description].filter(Boolean),
          {
            y: 80,
            autoAlpha: 0,
            scaleX: 0.9,
            filter: "blur(14px)",
            transformOrigin: "left center",
          },
          {
            y: 0,
            autoAlpha: 1,
            scaleX: 1,
            filter: "blur(0px)",
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              once: true,
            },
          },
        );

        if (cards.length) {
          gsap.fromTo(
            cards,
            {
              y: 110,
              autoAlpha: 0,
              scale: 0.92,
              rotateX: -10,
              filter: "blur(14px)",
              transformOrigin: "50% 100%",
            },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 1.1,
              stagger: { each: 0.08, from: "start" },
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                once: true,
              },
            },
          );
        }

        if (images.length) {
          gsap.fromTo(
            images,
            { clipPath: "inset(0 0 100% 0)", y: 72, scale: 1.12, filter: "blur(10px)" },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.28,
              stagger: 0.08,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 66%",
                once: true,
              },
            },
          );
        }

        if (parallaxItems.length) {
          gsap.to(parallaxItems, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          });
        }
      });
      }, scope);
    }

    setupMotion();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [rootRef]);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1 text-violet-200" aria-label={`难度 ${value} 星`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < value ? "fill-violet-200" : "opacity-25"}`}
        />
      ))}
    </div>
  );
}

function normalizeSongTitle(title: string) {
  return title
    .replace(/[《》\s]/g, "")
    .replace(/\(.*?\)|（.*?）/g, "")
    .replace(/的/g, "")
    .toLowerCase();
}

function getQQAlbumCover(albumMid: string) {
  return albumMid
    ? `https://y.gtimg.cn/music/photo_new/T002R500x500M000${albumMid}.jpg`
    : "";
}

function getQQSongPlayUrl(songMid?: string) {
  return songMid ? `https://y.qq.com/n/ryqq/songDetail/${songMid}` : "";
}

function getQQSearchUrl(song: Song) {
  return `https://y.qq.com/n/ryqq/search?w=${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}

const manualSongCovers = new Map([
  ["消愁", "002xoonH2Bk7FR"],
  ["成都", "003ltiMR4RSrgo"],
  ["爱错", "002ElVxf43rOue"],
]);

function SongCard({
  song,
  index,
  coverUrl,
  playUrl,
}: {
  song: Song;
  index: number;
  coverUrl: string;
  playUrl: string;
}) {
  return (
    <article
      data-card
      key={song.title}
      className={`song-card ${coverUrl ? "has-song-cover" : ""}`}
      style={
        coverUrl
          ? ({ "--song-cover": `url(${coverUrl})` } as CSSProperties)
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-violet-200">{song.artist}</p>
          <h4 className="mt-2 text-2xl font-semibold text-white">《{song.title}》</h4>
        </div>
        <a
          className="song-play-button"
          href={playUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`试听《${song.title}》`}
          title={`试听《${song.title}》`}
        >
          <Mic2 className="h-5 w-5" />
        </a>
      </div>
      {coverUrl && <div className="song-sync-badge">QQ音乐专辑背景</div>}
      <div className="mt-5 flex flex-wrap gap-2">
        {song.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-violet-200/10 px-3 py-1 text-xs text-violet-100">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/38">演唱难度</p>
        <Rating value={song.difficulty} />
      </div>
      <p className="mt-6 min-h-16 text-sm leading-6 text-white/64">{song.comment}</p>
      <div className="mt-6 border-t border-white/8 pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/38">适合场景</p>
        <p className="mt-2 text-sm leading-6 text-white/64">{song.scene}</p>
      </div>
    </article>
  );
}

function Waveform() {
  return (
    <div className="waveform" aria-hidden="true">
      {Array.from({ length: 54 }).map((_, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.045}s` }} />
      ))}
    </div>
  );
}

function MusicGlyphs() {
  const glyphs = ["♪", "♫", "♬", "♩", "♭", "♯"];

  return (
    <div className="music-glyphs" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 29) % 96}%`,
            top: `${8 + ((index * 41) % 76)}%`,
            animationDelay: `${index * 0.42}s`,
            animationDuration: `${7 + (index % 5)}s`,
          }}
        >
          {glyphs[index % glyphs.length]}
        </span>
      ))}
    </div>
  );
}

function ParticleField() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 42 }).map((_, index) => (
        <i
          key={index}
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            animationDelay: `${(index % 12) * 0.55}s`,
            animationDuration: `${8 + (index % 9)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldLoadVideo(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    playVideo();
    document.addEventListener("visibilitychange", playVideo);

    return () => {
      document.removeEventListener("visibilitychange", playVideo);
    };
  }, [shouldLoadVideo]);

  return (
    <section id="home" className="dopamine-hero relative min-h-screen overflow-hidden">
      <div className="opening-mask" aria-hidden="true" />
      <div className="hero-video-layer absolute inset-0">
        <img
          className={`hero-video hero-poster-backdrop ${isVideoReady ? "is-hidden" : ""}`}
          src="/images/hero-poster.jpg"
          alt=""
        />
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className={`hero-video ${isVideoReady ? "is-ready" : ""}`}
            src="/videos/hero-video.mp4#t=10"
            poster="/images/hero-poster.jpg"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={(event) => {
              setIsVideoReady(true);
              void event.currentTarget.play().catch(() => undefined);
            }}
          />
        ) : null}
        <div className="hero-video-overlay" />
      </div>
      <div className="hero-liquid-effect" aria-hidden="true">
        <Suspense fallback={null}>
          <LiquidEther
            colors={["#ff9ffc", "#42fcff", "#ffe56f"]}
            mouseForce={14}
            cursorSize={150}
            resolution={0.42}
            autoSpeed={0.34}
            autoIntensity={1.85}
          />
        </Suspense>
      </div>
      <ParticleField />
      <MusicGlyphs />
      <div className="scanline" aria-hidden="true" />
      <nav className="nav-shell fixed left-1/2 top-6 z-50 w-[min(calc(100%-32px),1120px)] -translate-x-1/2 rounded-full border border-white/40 bg-white/65 px-4 py-3 shadow-glow backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <button
            className="flex items-center gap-2 text-sm font-semibold text-[#1d1b2a]"
            onClick={() => scrollToId("home")}
          >
            <Disc3 className="h-5 w-5 text-fuchsia-500" />
            {profile.englishName}
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                className="rounded-full px-4 py-2 text-sm text-[#1d1b2a]/70 transition hover:bg-white/70 hover:text-[#1d1b2a]"
                onClick={() => scrollToId(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="dark-action rounded-full bg-[#1d1b2a] px-4 py-2 text-sm font-semibold transition hover:bg-fuchsia-500"
            onClick={() => scrollToId("songs")}
          >
            歌单
          </button>
        </div>
      </nav>
      <div className="relative z-10 mx-auto grid min-h-screen max-w-universe items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hero-copy flex flex-col items-start text-left">
          <p className="hero-kicker mb-5 rounded-full border border-white/55 bg-white/60 px-5 py-2 text-sm uppercase tracking-[0.28em] text-fuchsia-600 backdrop-blur-xl">
            {profile.role}
          </p>
          <h1 className="hero-title max-w-5xl text-balance text-5xl font-semibold leading-tight text-[#171421] md:text-7xl xl:text-8xl">
            <span className="hero-title-clip">
              <span className="hero-title-line">用声音记录生活，</span>
            </span>
            <span className="hero-title-clip">
              <span className="hero-title-line">用音乐表达自己</span>
            </span>
          </h1>
          <p className="hero-subtitle mt-7 text-xl text-[#2d2840]/68 md:text-2xl">
            {profile.heroSubtitle}
          </p>
          <div className="hero-actions mt-10 flex flex-wrap justify-center gap-4">
            <button
              className="dark-action inline-flex items-center gap-2 rounded-full bg-[#1d1b2a] px-7 py-4 font-semibold transition hover:bg-fuchsia-500"
              onClick={() => scrollToId("songs")}
            >
              进入我的歌单
              <ArrowDown className="h-5 w-5" />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-7 py-4 font-semibold text-[#1d1b2a] backdrop-blur-xl transition hover:bg-white/80"
              onClick={() => scrollToId("contact")}
            >
              联系我
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="hero-portrait mx-auto w-full max-w-[520px]">
          <div className="avatar-orbit">
            <div className="avatar-magic-rings" aria-hidden="true">
              <Suspense fallback={null}>
                <MagicRings
                  color="#ff4fd8"
                  colorTwo="#43d7ff"
                  ringCount={7}
                  speed={0.8}
                  attenuation={8.5}
                  lineThickness={1.8}
                  baseRadius={0.2}
                  radiusStep={0.075}
                  scaleRate={0.12}
                  opacity={0.78}
                  blur={0.4}
                  rotation={16}
                  followMouse
                  mouseInfluence={0.08}
                  parallax={0.025}
                />
              </Suspense>
            </div>
            <img src="/images/my-avatar.jpg" alt="我的头像" decoding="async" />
          </div>
          <div className="now-card">
            <Headphones className="h-5 w-5 text-fuchsia-500" />
            <span>NOW</span>
            <strong>多巴胺音乐模式</strong>
          </div>
        </div>
      </div>
      <Waveform />
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading relative mb-12 max-w-3xl">
      <p className="section-giant-title" aria-hidden="true">
        {eyebrow}
      </p>
      <p className="section-eyebrow mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-violet-200">
        {eyebrow}
      </p>
      <h2 className="section-title text-4xl font-semibold text-white md:text-6xl">{title}</h2>
      <p className="section-description mt-5 text-lg leading-8 text-white/58">{description}</p>
    </div>
  );
}

function MusicDna() {
  return (
    <section id="dna" className="designer-section section-shell dna-dopamine-section overflow-hidden">
      <div className="section-dopamine-bg" aria-hidden="true">
        <div className="bubble bubble-a" />
        <div className="bubble bubble-b" />
        <div className="bubble bubble-c" />
      </div>
      <div className="dna-liquid-effect" aria-hidden="true">
        <Suspense fallback={null}>
          <LiquidEther
            colors={["#ff75c8", "#6fefff", "#ffe875"]}
            mouseForce={10}
            cursorSize={170}
            resolution={0.36}
            autoSpeed={0.28}
            autoIntensity={1.55}
          />
        </Suspense>
      </div>
      <div className="dna-magic-rings" aria-hidden="true">
        <Suspense fallback={null}>
          <MagicRings
            color="#ff4fd8"
            colorTwo="#42fcff"
            ringCount={6}
            speed={0.62}
            attenuation={9}
            lineThickness={1.6}
            baseRadius={0.22}
            radiusStep={0.085}
            scaleRate={0.1}
            opacity={0.44}
            blur={0.2}
            rotation={-18}
          />
        </Suspense>
      </div>
      <MusicGlyphs />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Music DNA"
          title="我的声音画像"
          description="我的音乐审美不是单一曲风，而是一组关于旋律、故事、声线和情绪推进的坐标。"
        />
      </div>
      <div className="relative z-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {musicDna.map((item, index) => (
          <article
            data-card
            key={item.title}
            className="glass-card min-h-72 p-6"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-violet-300/15 text-violet-100">
              <Music2 className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-6 text-white/58">{item.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {item.representatives.map((name) => (
                <span key={name} className="rounded-full bg-white/8 px-3 py-1 text-sm text-white/78">
                  {name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="relative z-10 mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {artists.map((artist) => (
          <div key={artist.name} className="artist-album-card" data-card>
            <div className={`album-cover bg-gradient-to-br ${artist.albumTone}`} data-reveal-image>
              <img
                className="artist-portrait"
                src={artist.portrait}
                alt={`${artist.name} 画像`}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: artist.portraitPosition ?? "center top" }}
              />
              <span className="album-groove" />
              <span className="album-mark">{artist.albumMark}</span>
              <Music2 className="album-note h-9 w-9" />
            </div>
            <div className="p-5">
              <p className="text-lg font-semibold text-white">{artist.name}</p>
              <p className="mt-1 text-sm font-semibold text-fuchsia-600">{artist.albumTitle}</p>
              <p className="mt-3 text-sm leading-6 text-white/52">{artist.direction}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SongLibrary() {
  const qqSongMap = useMemo(() => {
    return new Map(
      qqImportedPlaylist.songs
        .filter((song) => song.albumMid)
        .map((song) => [normalizeSongTitle(song.title), song]),
    );
  }, []);

  function findSyncedSong(song: Song) {
    const normalizedTitle = normalizeSongTitle(song.title);

    return (
      qqSongMap.get(normalizedTitle) ??
      qqImportedPlaylist.songs.find((item) => {
        const importedTitle = normalizeSongTitle(item.title);
        return (
          item.albumMid &&
          (importedTitle.includes(normalizedTitle) ||
            normalizedTitle.includes(importedTitle))
        );
      })
    );
  }

  function findSongCover(song: Song) {
    const manualAlbumMid = manualSongCovers.get(song.title);
    if (manualAlbumMid) {
      return getQQAlbumCover(manualAlbumMid);
    }

    const syncedSong = findSyncedSong(song);
    return syncedSong ? getQQAlbumCover(syncedSong.albumMid) : "";
  }

  function findSongPlayUrl(song: Song) {
    const syncedSong = findSyncedSong(song);
    return getQQSongPlayUrl(syncedSong?.mid) || getQQSearchUrl(song);
  }

  const grouped = useMemo<Record<Song["category"], Song[]>>(
    () => ({
      情绪表达类: songs.filter((song) => song.category === "情绪表达类"),
      男声高质量发挥歌曲: songs.filter((song) => song.category === "男声高质量发挥歌曲"),
    }),
    [],
  );

  return (
    <section id="songs" className="designer-section section-shell">
      <SectionHeader
        eyebrow="KTV Archive"
        title="我的KTV必唱曲库"
        description="这不是普通歌单，而是按声音发挥、情绪表达和现场场景沉淀出的私人曲库。"
      />
      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="mb-14" data-card>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold text-white">{category}</h3>
            <span className="text-sm text-white/44">{list.length} 首档案歌曲</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {list.map((song, index) => {
              const coverUrl = findSongCover(song);
              const playUrl = findSongPlayUrl(song);

              return (
                <SongCard
                  key={song.title}
                  song={song}
                  index={index}
                  coverUrl={coverUrl}
                  playUrl={playUrl}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function Abilities() {
  return (
    <section className="designer-section section-shell">
      <SectionHeader
        eyebrow="Voice Ability"
        title="我的声音能力"
        description="把声音能力拆成可以长期观察和训练的模块，未来可以接入AI音乐分析。"
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {abilities.map((ability, index) => (
          <article
            data-card
            key={ability.title}
            className="glass-card p-7"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-300/12 text-blue-100">
              {index % 2 === 0 ? <Radio className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </div>
            <h3 className="text-2xl font-semibold text-white">{ability.title}</h3>
            <p className="mt-4 leading-7 text-white/58">{ability.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FutureModules() {
  return (
    <section className="designer-section section-shell">
      <div className="reserved-access-panel" data-card>
        <p className="section-giant-title" aria-hidden="true">
          Future System
        </p>
        <p className="section-eyebrow text-sm font-semibold uppercase tracking-[0.28em] text-violet-200">
          Future System
        </p>
        <h2 className="section-title mt-4 text-3xl font-semibold text-white md:text-5xl">后续扩展预留</h2>
        <p className="section-description mt-5 max-w-3xl text-lg leading-8 text-[#2d2840]/62">
          这里保留给未来的同步、分析和后台能力。内容已隐藏，仅预留访问口令入口。
        </p>
        <form className="reserved-access-form">
          <LockKeyhole className="h-6 w-6" />
          <input placeholder="输入访问口令后查看预留模块" type="password" />
          <button className="dark-action rounded-full bg-[#1d1b2a] px-5 py-3 font-semibold" type="button">
            验证
          </button>
        </form>
      </div>
    </section>
  );
}

function QQMusicSync() {
  return (
    <section id="qq-music" className="designer-section section-shell">
      <div className="qq-sync-panel" data-card>
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="section-giant-title" aria-hidden="true">
              QQ Music Sync
            </p>
            <p className="section-eyebrow text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
              QQ Music Sync
            </p>
            <h2 className="section-title mt-4 text-3xl font-semibold text-[#171421] md:text-5xl">
              QQ音乐同步控制台
            </h2>
            <p className="section-description mt-5 max-w-3xl text-lg leading-8 text-[#2d2840]/62">
              已接入你的 QQ音乐歌单链接。当前版本先做成可维护的同步面板，包含同步状态、流程、预览歌曲和跳转入口。
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["歌单", qqMusicSync.playlistName],
                ["状态", qqMusicSync.status],
                ["最近同步", qqMusicSync.lastSyncText],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[8px] border border-white/55 bg-white/45 p-5 backdrop-blur-xl" data-card>
                  <p className="text-sm text-[#2d2840]/50">{title}</p>
                  <p className="mt-3 text-xl font-semibold text-[#171421]">{description}</p>
                </div>
              ))}
            </div>
            <a
              className="dark-action mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d1b2a] px-6 py-3 font-semibold"
              href={qqMusicSync.playlistUrl}
              target="_blank"
              rel="noreferrer"
            >
              <RefreshCw className="h-5 w-5" />
              打开我的 QQ音乐歌单
            </a>
            <div className="qq-sync-mascot" data-reveal-image data-parallax>
              <div className="qq-mascot-rings" aria-hidden="true">
                <Suspense fallback={null}>
                  <MagicRings
                    color="#ff4fd8"
                    colorTwo="#4be6d8"
                    ringCount={5}
                    speed={0.7}
                    attenuation={8.5}
                    lineThickness={1.5}
                    baseRadius={0.25}
                    radiusStep={0.08}
                    scaleRate={0.08}
                    opacity={0.48}
                  />
                </Suspense>
              </div>
              <img src="/images/qq-sync-mascot.jpg" alt="挥手头像" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="qq-preview-card" data-card>
            <div className="flex items-center gap-5">
              <div className="qq-cover" data-reveal-image>
                {qqMusicSync.coverUrl ? (
                  <img src={qqMusicSync.coverUrl} alt={`${qqMusicSync.playlistName} 封面`} loading="lazy" decoding="async" />
                ) : (
                  <Disc3 className="h-14 w-14 animate-spin text-fuchsia-500 [animation-duration:8s]" />
                )}
              </div>
              <div>
                <p className="text-sm text-[#2d2840]/50">QQ音乐歌单</p>
                <h3 className="mt-1 text-3xl font-semibold text-[#171421]">
                  {qqMusicSync.playlistName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#2d2840]/60">
                  {qqMusicSync.playlistDescription || "已同步你的公开歌单。"}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[8px] border border-white/50 bg-white/35 p-4">
              <p className="text-sm text-[#2d2840]/50">已解析歌曲</p>
              <p className="mt-1 text-4xl font-semibold text-[#171421]">
                {qqMusicSync.totalLinkedSongs}
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {qqMusicSync.matchedSongs.map((song, index) => (
                <div key={`${song.title}-${song.artist}`} className="qq-track-row" data-card>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold text-[#171421]">《{song.title}》</p>
                    <p className="text-sm text-[#2d2840]/56">
                      {song.artist} · {song.album} · {song.durationText}
                    </p>
                  </div>
                  <a
                    className="song-play-button qq-track-play"
                    href={getQQSongPlayUrl(song.mid)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`试听《${song.title}》`}
                    title={`试听《${song.title}》`}
                  >
                    <Mic2 className="h-5 w-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {qqMusicSync.pipeline.map((step) => (
            <div key={step.title} className="sync-step" data-card>
              <span>{step.state}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminPanel() {
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessError, setAccessError] = useState("");

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (accessCode.trim() === adminAccess.code) {
      setIsUnlocked(true);
      setAccessError("");
      return;
    }

    setAccessError("访问口令不正确。");
  }

  return (
    <section id="admin" className="designer-section section-shell">
      <div className="admin-panel" data-card>
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-giant-title" aria-hidden="true">
              Private Admin
            </p>
            <p className="section-eyebrow text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
              Private Admin
            </p>
            <h2 className="section-title mt-4 text-3xl font-semibold text-[#171421] md:text-5xl">
              私人后台管理
            </h2>
            <p className="section-description mt-5 text-lg leading-8 text-[#2d2840]/62">
              这里是未来的 /admin 管理入口雏形。第一版先加入访问口令门禁，解锁后才能看到后台操作区。
            </p>
          </div>
          <div className="admin-console" data-card>
            <div className="admin-login-bar">
              <span>{isUnlocked ? "已解锁" : "访问控制"}</span>
              <strong>{isUnlocked ? "ONLINE" : "/admin"}</strong>
            </div>
            {!isUnlocked ? (
              <form className="admin-lock-card" onSubmit={handleUnlock}>
                <div className="admin-lock-icon">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h3>输入访问口令</h3>
                <p>后台内容已隐藏。验证通过后可以查看歌曲管理、同步控制和资料维护入口。</p>
                <input
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value)}
                  placeholder="请输入访问口令"
                  type="password"
                />
                {accessError && <span className="admin-error">{accessError}</span>}
                <button className="dark-action rounded-full bg-[#1d1b2a] px-5 py-3 font-semibold">
                  解锁后台
                </button>
              </form>
            ) : (
              <>
                <div className="admin-unlocked-banner">
                  <ShieldCheck className="h-5 w-5" />
                  <span>访问已通过，后台管理入口已启用。</span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {adminModules.map((module) => (
                    <article key={module.title} className="admin-module-card" data-card>
                      <span>{module.status}</span>
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="dark-action rounded-full bg-[#1d1b2a] px-5 py-3 font-semibold">
                    添加歌曲
                  </button>
                  <button className="rounded-full border border-white/60 bg-white/55 px-5 py-3 font-semibold text-[#1d1b2a]">
                    触发同步
                  </button>
                  <button className="rounded-full border border-white/60 bg-white/55 px-5 py-3 font-semibold text-[#1d1b2a]">
                    修改资料
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="designer-section relative min-h-screen overflow-hidden">
      <ParticleField />
      <MusicGlyphs />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,105,180,0.22),transparent_38%),linear-gradient(135deg,#fff3b8,#ffd3e9_42%,#bff5ff)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-universe flex-col justify-center px-6 py-24">
        <p className="section-giant-title" aria-hidden="true">
          Contact
        </p>
        <p className="section-eyebrow mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-violet-200">
          Contact
        </p>
        <h2 className="section-title max-w-5xl text-5xl font-semibold leading-tight text-white md:text-8xl">
          {profile.closingLine}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-[1fr_1fr_220px]">
          <div className="glass-card p-7" data-card>
            <p className="text-sm uppercase tracking-[0.22em] text-white/38">邮箱</p>
            <p className="mt-3 text-2xl font-semibold text-white">{profile.email}</p>
          </div>
          <div className="glass-card p-7" data-card>
            <p className="text-sm uppercase tracking-[0.22em] text-white/38">社交账号</p>
            <p className="mt-3 text-2xl font-semibold text-white">{profile.social}</p>
          </div>
          <div className="glass-card flex aspect-square items-center justify-center p-6" data-card>
            <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-sm ${[0, 1, 5, 6, 18, 19, 23, 24, 12, 8, 16].includes(index) ? "bg-white" : "bg-white/12"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const appRef = useRef<HTMLElement | null>(null);
  useDesignerMotion(appRef);

  return (
    <main ref={appRef} className="dopamine-universe min-h-screen text-[#1d1b2a]">
      <Hero />
      <MusicDna />
      <SongLibrary />
      <Abilities />
      <QQMusicSync />
      <FutureModules />
      <AdminPanel />
      <Contact />
    </main>
  );
}
