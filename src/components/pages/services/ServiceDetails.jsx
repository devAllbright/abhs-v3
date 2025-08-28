import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import serviceDetails from "../../../data/serviceDetails.json";

export default function ServiceDetails({
  serviceName,
  loopMain = true,
  autoplayMain = true,
  autoplayIntervalMs = 5000,
  showDots = true,
}) {
  const serviceData = serviceDetails?.[serviceName];
  if (!serviceData) {
    return (
      <div className="service-details">
        <p className="service-details__fallback">No data found for “{serviceName}”.</p>
      </div>
    );
  }

  // MAIN (A): zones already an array; description is now a STRING
  const mainCards = (serviceData.main?.zones || []).map((z) => ({
    title: z.title,
    paragraph: typeof z.description === "string" ? z.description : "",
    image: z.image,
  }));

  // SMALL blocks: convert each block into an array of cards:
  //   [ {kind:'header', title, image}, ...items ]
  const normalizeBlock = (b) => {
    if (!b) return [];
    const headerCard = { kind: "header", title: b.title, image: b.image };
    const items = Array.isArray(b.description) ? b.description : [b.description].filter(Boolean);
    const itemCards = items.map((text) => ({ kind: "item", text, background: b.background || "css-bg" }));
    return [headerCard, ...itemCards];
  };

  const blocks = {
    topRight: normalizeBlock(serviceData.blocks?.topRight),
    middleRight: normalizeBlock(serviceData.blocks?.middleRight),
    bottomRight: normalizeBlock(serviceData.blocks?.bottomRight),
    bottomMiddle: normalizeBlock(serviceData.blocks?.bottomMiddle),
    bottomLeft: normalizeBlock(serviceData.blocks?.bottomLeft),
  };

  return (
    <div className="service-details">
      <div className="service-details__grid">
        {/* MAIN (A) */}
        <Tile area="A">
          <EmblaTile
            mode="main"
            cards={mainCards}
            loop={loopMain}
            autoplay={autoplayMain}
            autoplayIntervalMs={autoplayIntervalMs}
            showDots={showDots}
            ariaLabel="Main block"
          />
        </Tile>

        {/* SMALL blocks (manual only) */}
        <Tile area="B">
          <EmblaTile mode="small" cards={blocks.topRight} loop={false} autoplay={false} showDots={false} ariaLabel="Quick Facts" />
        </Tile>
        <Tile area="C">
          <EmblaTile mode="small" cards={blocks.middleRight} loop={false} autoplay={false} showDots={false} ariaLabel="Highlights & Add-ons" />
        </Tile>
        <Tile area="D">
          <EmblaTile mode="small" cards={blocks.bottomLeft} loop={false} autoplay={false} showDots={false} ariaLabel="Extras & Optional Services" />
        </Tile>
        <Tile area="E">
          <EmblaTile mode="small" cards={blocks.bottomMiddle} loop={false} autoplay={false} showDots={false} ariaLabel="Pro Tips & Benefits" />
        </Tile>
        <Tile area="F">
          <EmblaTile mode="small" cards={blocks.bottomRight} loop={false} autoplay={false} showDots={false} ariaLabel="What’s Not Included" />
        </Tile>
      </div>
    </div>
  );
}

function Tile({ area, children }) {
  return <div className={`service-details__tile service-details__tile--${area.toLowerCase()}`}>{children}</div>;
}

function EmblaTile({
  mode = "main",               // "main" | "small"
  cards = [],
  loop = false,
  autoplay = false,
  autoplayIntervalMs = 5000,
  showDots = true,
  ariaLabel = "Carousel",
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const timerRef = useRef(null);

  // progress bar (main only)
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef(null);

  const isReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const totalSlides = cards?.length || 0;
  const hasMultiple = totalSlides > 1;

  const scrollTo = useCallback((idx) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // progress control (main only)
  const stopProgress = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
  }, []);

  const startProgress = useCallback(() => {
    if (mode !== "main" || !autoplay || isReducedMotion || !emblaApi) return;
    stopProgress();
    setProgress(0);
    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / autoplayIntervalMs) * 100));
      setProgress(pct);
      if (pct >= 100) {
        stopProgress();
        if (loop) {
          emblaApi.scrollNext();
        } else {
          const atLast = emblaApi.selectedScrollSnap() === (scrollSnaps.length - 1);
          emblaApi.scrollTo(atLast ? 0 : emblaApi.selectedScrollSnap() + 1);
        }
      }
    }, 100);
  }, [mode, autoplay, isReducedMotion, emblaApi, autoplayIntervalMs, loop, scrollSnaps.length, stopProgress]);

  // embla events
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      if (mode === "main") startProgress(); // reset progress on manual nav
    };
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    };
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, mode, startProgress]);

  // hover/visibility handling for main autoplay
  useEffect(() => {
    if (!emblaApi || !autoplay || mode !== "main" || isReducedMotion || !hasMultiple) return;

    const start = () => {
      stop();
      // safety timer; real timing is handled by progress interval
      timerRef.current = setInterval(() => {}, autoplayIntervalMs);
    };
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    const node = emblaApi.containerNode();
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    startProgress();
    node.addEventListener("mouseenter", stopProgress);
    node.addEventListener("mouseleave", startProgress);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      stopProgress();
      node.removeEventListener("mouseenter", stopProgress);
      node.removeEventListener("mouseleave", startProgress);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [emblaApi, autoplay, autoplayIntervalMs, mode, isReducedMotion, hasMultiple, startProgress, stopProgress]);

  if (!totalSlides) return null;

  // Button visibility logic:
  // - Buttons hidden by default via CSS; visible on hover
  // - If only 1 slide, never render buttons
  // - First slide hides "prev", last slide hides "next"
  const showPrev = hasMultiple && selectedIndex > 0;
  const showNext = hasMultiple && selectedIndex < totalSlides - 1;

  return (
    <div className={`embla ${mode === "small" ? "embla--small" : "embla--main"}`} aria-label={ariaLabel}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {cards.map((card, i) => (
            <div className="embla__slide" key={i}>
              {mode === "main" ? (
                <MainCard card={card} />
              ) : (
                <SmallCard card={card} />
              )}
            </div>
          ))}
        </div>
      </div>

      {hasMultiple && showPrev && (
        <button className="embla__btn embla__btn--prev" onClick={scrollPrev} aria-label="Previous card">◀</button>
      )}
      {hasMultiple && showNext && (
        <button className="embla__btn embla__btn--next" onClick={scrollNext} aria-label="Next card">▶</button>
      )}

      {showDots && mode === "main" && hasMultiple && (
        <div className="embla__dots">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              className={`embla__dot ${i === selectedIndex ? "is-selected" : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {mode === "main" && hasMultiple && (
        <div className="embla__progress">
          <div className="embla__progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function MainCard({ card }) {
  return (
    <div className="main-card">
      {/* Layer 1: background image */}
      <div className="main-card__bg" style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
      {/* Layer 2: dark overlay */}
      <div className="main-card__overlay" aria-hidden="true" />
      {/* Layer 3: content */}
      <div className="main-card__content">
        <h3 className="main-card__title">{card.title}</h3>
        {card.paragraph && <p className="main-card__paragraph">{card.paragraph}</p>}
      </div>
    </div>
  );
}

function SmallCard({ card }) {
  const isHeader = card.kind === "header";
  return (
    <div className={`small-card ${isHeader ? "small-card--header" : "small-card--item"}`}>
      {isHeader ? (
        // Header uses its own image from JSON
        <div className="small-card__bg small-card__bg--image" style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
      ) : (
        // Items use CSS background (solid or animated) via class hook
        <div className={`small-card__bg small-card__bg--css`} aria-hidden="true" />
      )}
      <div className="small-card__overlay" aria-hidden="true" />
      <div className="small-card__content">
        {isHeader ? (
          <h4 className="small-card__title">{card.title}</h4>
        ) : (
          <p className="small-card__text">{card.text}</p>
        )}
      </div>
    </div>
  );
}
