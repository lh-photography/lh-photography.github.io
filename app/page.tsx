"use client";

import Image from "next/image";
import { type FormEvent, type KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";

export const dynamic = "force-static";

type Category = "Football" | "Automotive" | "Action & Motorsport" | "City & Architecture" | "Portraits" | "Weddings";

type Photograph = {
  src: string;
  alt: string;
  number: string;
  title: string;
  category: Category;
  shape: "landscape" | "portrait";
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const photographs: Photograph[] = [
  { src: "/photos/photo-01.jpg", alt: "St Paul's Cathedral framed between red-brick buildings", number: "01", title: "St Paul's", category: "City & Architecture", shape: "portrait" },
  { src: "/photos/photo-02.jpg", alt: "Curved metal sculpture surrounded by glass towers in the City of London", number: "02", title: "City Geometry", category: "City & Architecture", shape: "portrait" },
  { src: "/photos/photo-03.jpg", alt: "Mountain biker performing a trick among trees", number: "03", title: "Trail Flight", category: "Action & Motorsport", shape: "portrait" },
  { src: "/photos/photo-04.jpg", alt: "Racing sidecar and two riders moving at speed on a circuit", number: "04", title: "Sidecar Racing", category: "Action & Motorsport", shape: "landscape" },
  { src: "/photos/photo-05.jpg", alt: "Close low-angle detail of a grey Porsche race car numbered 63", number: "05", title: "Porsche 63", category: "Automotive", shape: "portrait" },
  { src: "/photos/photo-06.jpg", alt: "Orange McLaren sports car photographed from the front", number: "06", title: "McLaren Orange", category: "Automotive", shape: "portrait" },
  { src: "/photos/photo-07.jpg", alt: "Football player focused over the ball before play", number: "07", title: "Match Focus", category: "Football", shape: "portrait" },
  { src: "/photos/photo-08.jpg", alt: "Football player striking the ball during a match", number: "08", title: "The Strike", category: "Football", shape: "portrait" },
  { src: "/photos/photo-09.jpg", alt: "Football player taking a throw-in from the touchline", number: "09", title: "Touchline", category: "Football", shape: "portrait" },
  { src: "/photos/photo-10.jpg", alt: "Football player controlling the ball in warm sunlight", number: "10", title: "On the Ball", category: "Football", shape: "portrait" },
  { src: "/photos/photo-11.jpg", alt: "Football player driving forward between two defenders", number: "11", title: "Under Pressure", category: "Football", shape: "portrait" },
  { src: "/photos/photo-12.jpg", alt: "Studio headshot portrait photographed by Louie Harrington", number: "12", title: "Headshot Study", category: "Portraits", shape: "portrait" },
  { src: "/photos/photo-13.jpg", alt: "Close overhead view of two motorcycle racers leaning through a corner", number: "13", title: "Close Pursuit", category: "Action & Motorsport", shape: "portrait" },
  { src: "/photos/photo-14.jpg", alt: "Motorcycle racer captured at speed with a motion-blurred circuit behind", number: "14", title: "Track Speed", category: "Action & Motorsport", shape: "portrait" },
  { src: "/photos/photo-15.jpg", alt: "Two wedding rings resting on a personalised wooden ring box", number: "15", title: "The Rings", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-20.jpg", alt: "Bride holding a white bouquet while looking into an ornate mirror", number: "20", title: "Bridal Portrait", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-21.jpg", alt: "Bride applying perfume in front of an ornate mirror", number: "21", title: "Finishing Touches", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-16.jpg", alt: "Groom's shoes, bow tie, watch and accessories arranged by a window", number: "16", title: "Groom's Details", category: "Weddings", shape: "landscape" },
  { src: "/photos/photo-22.jpg", alt: "Groom adjusting his waistcoat while reflected in a mirror", number: "22", title: "Before the Ceremony", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-23.jpg", alt: "Black-and-white close-up of the groom's watch, cufflink and ring", number: "23", title: "Time & Detail", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-24.jpg", alt: "Framed welcome sign outside the wedding venue", number: "24", title: "The Welcome", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-17.jpg", alt: "Wedding seating plan beside a blue-and-white floral arrangement", number: "17", title: "Find Your Seat", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-25.jpg", alt: "Black-and-white view of the couple exchanging vows beneath a flower-covered canopy", number: "25", title: "The Ceremony", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-18.jpg", alt: "Newly married couple kissing outside a dark timber building", number: "18", title: "Just Married", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-26.jpg", alt: "Close portrait of the newly married couple framed by soft green leaves", number: "26", title: "Among the Leaves", category: "Weddings", shape: "portrait" },
  { src: "/photos/photo-19.jpg", alt: "Newly married couple kissing beside a framed wedding welcome sign", number: "19", title: "A Quiet Moment", category: "Weddings", shape: "portrait" },
];

const categories: Array<{ name: Category; id: string; note: string }> = [
  { name: "Football", id: "football", note: "Focus, pressure and the rhythm of match day." },
  { name: "Automotive", id: "automotive", note: "Shape, detail and character from exceptional cars." },
  { name: "Action & Motorsport", id: "action", note: "Movement held at exactly the right moment." },
  { name: "City & Architecture", id: "city", note: "Lines, landmarks and new angles on familiar places." },
  { name: "Portraits", id: "portraits", note: "Character-led portraits with a natural, considered feel." },
  { name: "Weddings", id: "weddings", note: "Details and moments captured while assisting the lead photographer." },
];

const services = [
  {
    name: "Assistant wedding photographer",
    price: "From £45",
    kicker: "Supporting wedding coverage",
    description: "Natural photographs of the ceremony and the moments around it, captured while assisting the lead photographer. Share the date, venue and coverage needed for a tailored quote.",
  },
  {
    name: "One-hour car shoot",
    price: "£25",
    kicker: "60-minute session",
    description: "A focused one-hour shoot built around the car: clean details, strong angles and a set of edited images.",
  },
  {
    name: "Family or property photos",
    price: "£30",
    kicker: "People & places",
    description: "Relaxed family photographs or polished images of a home or property, planned around the setting and purpose.",
  },
] as const;

const instagramUrl = "https://www.instagram.com/louie_photography55/";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const bookingEndpoint = process.env.NEXT_PUBLIC_BOOKING_ENDPOINT ?? "/api/enquiry";
const publicPath = (path: string) => `${publicBasePath}${path}`;

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Louie Harrington Photography — home">
      <Image className="brand__image" src={publicPath("/photos/logo.jpg")} alt="" width={40} height={40} sizes="40px" />
      <span className="brand__name">Louie Harrington</span>
    </a>
  );
}

function Photo({
  photograph,
  className = "",
  priority = false,
  sizes = "(max-width: 620px) calc(100vw - 32px), (max-width: 900px) 48vw, 40vw",
}: {
  photograph: Photograph;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`photo-surface ${className}`}>
      <Image src={publicPath(photograph.src)} alt={photograph.alt} fill sizes={sizes} priority={priority} />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("Football");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [bookingService, setBookingService] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % photographs.length);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + photographs.length) % photographs.length);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex]);

  const activeCategoryDetails = categories.find((category) => category.name === activeCategory) ?? categories[0];
  const activePhotos = photographs.filter((photograph) => photograph.category === activeCategory);
  const closeMenu = () => setMenuOpen(false);
  const showPrevious = () => setSelectedIndex((current) => current === null ? null : (current - 1 + photographs.length) % photographs.length);
  const showNext = () => setSelectedIndex((current) => current === null ? null : (current + 1) % photographs.length);

  const chooseCategory = (category: Category) => {
    setActiveCategory(category);
    setSelectedIndex(null);
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % categories.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + categories.length) % categories.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = categories.length - 1;
    chooseCategory(categories[nextIndex].name);
    document.getElementById(`tab-${categories[nextIndex].id}`)?.focus();
  };

  const startBooking = (serviceName: string) => {
    setBookingService(serviceName);
    setFormStatus("idle");
    setFormMessage("");
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus("submitting");
    setFormMessage("Sending your request…");

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(bookingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({ error: "The request could not be sent." }));

      if (!response.ok) throw new Error(result.error || "The request could not be sent.");

      form.reset();
      setBookingService("");
      setFormStatus("success");
      setFormMessage("Request sent. Louie can reply directly to the email address you entered.");
    } catch (error) {
      setFormStatus("error");
      setFormMessage(error instanceof Error ? error.message : "The request could not be sent. Please try Instagram instead.");
    }
  };

  return (
    <main id="top">
      <header className="site-header">
        <Brand />
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Portfolio</a>
          <a href="#services" onClick={closeMenu}>Prices</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#booking" onClick={closeMenu}>Book</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow"><span>Sports · Action · Moments</span><span>Chelmsford · Danbury · Essex</span></p>
          <h1 id="hero-title">Moments,<br /><em>honestly framed.</em></h1>
          <p className="hero__intro">Sports, cars, portraits and moments of movement, photographed around Chelmsford, Danbury and Essex by Louie Harrington.</p>
          <div className="hero__actions">
            <a className="text-link" href="#work">View the work <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="#booking">Request a shoot <span aria-hidden="true">↘</span></a>
          </div>
        </div>
        <div className="hero__visual">
          <Photo photograph={photographs[0]} priority sizes="(max-width: 900px) 100vw, 56vw" />
          <p className="image-note"><span>St Paul&apos;s, London</span><span>01 / {photographs.length}</span></p>
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 id="work-title">Selected work</h2>
          </div>
          <p className="section-intro">Choose a collection to keep the view focused. Only one set is shown at a time.</p>
        </div>

        <div className="portfolio-tabs" role="tablist" aria-label="Portfolio collections">
          {categories.map((category, index) => (
            <button
              id={`tab-${category.id}`}
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.name}
              aria-controls="portfolio-panel"
              tabIndex={activeCategory === category.name ? 0 : -1}
              onClick={() => chooseCategory(category.name)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>0{index + 1}</span>{category.name}
            </button>
          ))}
        </div>

        <div className="portfolio-panel" id="portfolio-panel" role="tabpanel" aria-labelledby={`tab-${activeCategoryDetails.id}`} tabIndex={0}>
          <div className="portfolio-panel__heading">
            <div>
              <p className="eyebrow">Current collection</p>
              <h3>{activeCategoryDetails.name}</h3>
            </div>
            <p>{activeCategoryDetails.note}</p>
            <p className="portfolio-panel__count">{String(activePhotos.length).padStart(2, "0")} photographs</p>
          </div>
          <div className={`gallery tab-gallery tab-gallery--${activeCategoryDetails.id}`}>
            {activePhotos.map((photograph) => {
              const index = photographs.findIndex((photo) => photo.src === photograph.src);
              return (
                <button className={`gallery-item gallery-item--${photograph.shape}`} type="button" key={photograph.src} onClick={() => setSelectedIndex(index)} aria-label={`Open ${photograph.alt}`}>
                  <Photo photograph={photograph} />
                  <span className="gallery-item__meta">
                    <span>{photograph.number} · {photograph.title}</span>
                    <span aria-hidden="true">View ↗</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services" id="services" aria-labelledby="services-title">
        <div className="section-heading section-heading--light">
          <p className="section-number">02</p>
          <div>
            <p className="eyebrow">Shoots & pricing</p>
            <h2 id="services-title">Simple starting prices.</h2>
          </div>
          <p className="section-intro">Choose the closest option, then send the date, location and what you have in mind.</p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.name}>
              <div className="service-card__topline"><span>0{index + 1}</span><span>{service.kicker}</span></div>
              <h3>{service.name}</h3>
              <p className="service-card__price">{service.price}</p>
              <p className="service-card__description">{service.description}</p>
              <button className="service-card__button" type="button" onClick={() => startBooking(service.name)}>
                Request this shoot <span aria-hidden="true">↘</span>
              </button>
            </article>
          ))}
        </div>
        <p className="pricing-note">These are starting prices. Travel, venue access and unusual requirements can affect the final quote; the price is confirmed before a booking is agreed.</p>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about__label">
          <p className="section-number">03</p>
          <p className="eyebrow">Behind the lens</p>
        </div>
        <div className="about__content">
          <h2 id="about-title">Sports, action and moments—seen through Louie&apos;s lens.</h2>
          <div className="about__profile">
            <div className="about__portrait"><Image src={publicPath("/photos/louie-portrait.jpg")} alt="Louie Harrington photographing from the sideline" fill sizes="(max-width: 900px) 100vw, 42vw" /></div>
            <div className="about__details">
              <Image className="about__logo" src={publicPath("/photos/logo.jpg")} alt="Louie Harrington Photography logo" width={320} height={320} sizes="(max-width: 620px) calc(100vw - 32px), 320px" />
              <div className="about__copy">
                <p>Louie Harrington is a young photographer developing a portfolio across sport, action, automotive, portraits, city and assistant wedding photography.</p>
                <p>His work looks for the decisive moment: the split second where movement, expression and composition come together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="booking" id="booking" aria-labelledby="booking-title">
        <div className="booking__intro">
          <p className="section-number">04</p>
          <p className="eyebrow">Request a booking</p>
          <h2 id="booking-title">Tell Louie what you&apos;d like photographed.</h2>
          <p>Enter your email and the details of the shoot. The request is delivered privately so Louie can reply—his email address is never shown on this website.</p>
          <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">Prefer Instagram? <span>@louie_photography55 ↗</span></a>
        </div>

        <form className="booking-form" onSubmit={submitBooking} aria-describedby="booking-privacy booking-status">
          <div className="form-row">
            <label>
              Your name
              <input name="name" type="text" autoComplete="name" maxLength={80} required />
            </label>
            <label>
              Your email
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={160} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Type of shoot
              <select name="service" value={bookingService} onChange={(event) => setBookingService(event.target.value)} required>
                <option value="">Choose an option</option>
                {services.map((service) => <option key={service.name}>{service.name}</option>)}
                <option>Something else</option>
              </select>
            </label>
            <label>
              Preferred date <span className="optional">Optional</span>
              <input name="preferredDate" type="date" />
            </label>
          </div>
          <label>
            Location or area <span className="optional">Optional</span>
            <input name="location" type="text" placeholder="Town, venue or football ground" maxLength={120} />
          </label>
          <label>
            What would you like?
            <textarea name="message" rows={6} placeholder="Share the event, timings and the photographs you need." minLength={10} maxLength={2000} required />
          </label>
          <label className="hidden-field" aria-hidden="true">
            Leave this empty
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <button className="submit-button" type="submit" disabled={formStatus === "submitting"}>
            {formStatus === "submitting" ? "Sending…" : "Send booking request"}<span aria-hidden="true">→</span>
          </button>
          <p className="form-status" id="booking-status" role="status" data-state={formStatus}>{formMessage}</p>
          <p className="form-privacy" id="booking-privacy">Please do not send passwords, payment details or sensitive information. Requests should be made or approved by an adult. Details are used only to respond to the enquiry. <a href={`${publicBasePath}/privacy/`}>Privacy details</a>.</p>
        </form>
      </section>

      <footer>
        <Brand />
        <p>© 2026 Louie Harrington Photography</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      {selectedIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer" onClick={() => setSelectedIndex(null)}>
          <button className="lightbox__close" type="button" aria-label="Close photograph viewer" onClick={() => setSelectedIndex(null)}>Close</button>
          <button className="lightbox__arrow lightbox__arrow--left" type="button" aria-label="Previous photograph" onClick={(event) => { event.stopPropagation(); showPrevious(); }}>←</button>
          <div className="lightbox__image" onClick={(event) => event.stopPropagation()}>
            <Photo photograph={photographs[selectedIndex]} priority sizes="100vw" />
            <p><span>{photographs[selectedIndex].category} · {photographs[selectedIndex].title}</span><span>{photographs[selectedIndex].number} / {photographs.length}</span></p>
          </div>
          <button className="lightbox__arrow lightbox__arrow--right" type="button" aria-label="Next photograph" onClick={(event) => { event.stopPropagation(); showNext(); }}>→</button>
        </div>
      )}
    </main>
  );
}
