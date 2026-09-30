/** Progressive enhancement: content remains visible without animation support. */
export function initMotion() {
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const photo = hero.querySelector(".hero-backdrop");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Set();
  let reduced = preference.matches;
  let frame = 0;
  let heroVisible = true;
  const control = document.createElement("button");
  control.type = "button";
  control.className = "motion-control";
  hero.append(control);

  function animate(element, frames, options) {
    if (reduced || !element.animate) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.then(
      () => animations.delete(animation),
      () => animations.delete(animation),
    );
  }

  function paint() {
    frame = 0;
    if (document.hidden) return;
    const range = root.scrollHeight - innerHeight;
    root.style.setProperty(
      "--reading-progress",
      range > 0 ? Math.min(1, scrollY / range) : 0,
    );
    if (!reduced && heroVisible) {
      const offset = Math.min(
        28,
        Math.max(0, -hero.getBoundingClientRect().top * 0.045),
      );
      photo.style.transform = `translateY(${offset}px)`;
    }
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
  }

  function syncPreference() {
    root.dataset.motion = reduced ? "reduced" : "full";
    control.textContent = reduced ? "Ativar movimento" : "Reduzir movimento";
    control.setAttribute("aria-pressed", String(reduced));
    if (reduced) {
      animations.forEach((animation) => animation.cancel());
      photo.style.transform = "";
    }
    schedule();
  }

  control.addEventListener("click", () => {
    reduced = !reduced;
    syncPreference();
  });
  preference.addEventListener("change", (event) => {
    reduced = event.matches;
    syncPreference();
  });
  syncPreference();

  const ease = "cubic-bezier(.22,1,.36,1)";
  // `translate` composes with the kicker's CSS rotation instead of replacing it.
  hero.querySelectorAll(".hero-kicker, .title-line").forEach((line, index) => {
    animate(
      line,
      [
        { opacity: 0, translate: "0 28px", clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, translate: "0 0", clipPath: "inset(0 0 0% 0)" },
      ],
      { duration: 1050, delay: index * 130, easing: ease, fill: "backwards" },
    );
  });
  hero
    .querySelectorAll(".hero-offer, .hero-actions, .hero-proof")
    .forEach((block, index) =>
      animate(
        block,
        [
          { opacity: 0, translate: "0 12px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: 700,
          delay: 480 + index * 110,
          easing: ease,
          fill: "backwards",
        },
      ),
    );

  if ("IntersectionObserver" in window) {
    const images = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(
            entry.target,
            [
              {
                clipPath: "inset(0 0 12% 0)",
                transform: "translateY(20px)",
                opacity: 0.65,
              },
              {
                clipPath: "inset(0 0 0% 0)",
                transform: "translateY(0)",
                opacity: 1,
              },
            ],
            { duration: 1000, easing: ease },
          );
          images.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".dish-photo, .story-photo img, .story-family img")
      .forEach((image) => images.observe(image));
    const visibility = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      schedule();
    });
    visibility.observe(hero);
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  document.addEventListener("visibilitychange", () => {
    animations.forEach((animation) =>
      document.hidden ? animation.pause() : animation.play(),
    );
    schedule();
  });
}
