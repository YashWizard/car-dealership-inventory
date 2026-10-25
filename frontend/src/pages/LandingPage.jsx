import "./LandingPage.css";

export default function LandingPage({ onSignIn }) {
  return (
    <div className="showroom">
      <div className="sr-announcement">
        <span aria-hidden="true">●</span>
        A clearer way to find your next drive.
      </div>

      <header className="sr-header">
        <a href="#top" className="sr-brand">
          <span className="sr-logo">D</span>
          DriveLedger <span className="sr-brand-secondary">motors</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#collection">The collection</a>
          <a href="#approach">Our approach</a>
        </nav>

        <button className="sr-button sr-outline" onClick={onSignIn}>
          Sign in <span aria-hidden="true">↗</span>
        </button>
      </header>

      <main id="top">
        <section className="sr-hero" aria-labelledby="sr-title">
          <div className="sr-hero-copy">
            <p className="sr-eyebrow">THE ROAD AHEAD</p>
            <h1 id="sr-title">Find your{" "}<br />next <span>chapter.</span></h1>
            <p className="sr-description">
              A clearer way to explore cars. Browse the collection,
              compare listed prices, and find a drive that fits your plans.
            </p>

            <a href="#collection" className="sr-button sr-orange">
              Explore the collection <span aria-hidden="true">↓</span>
            </a>

            <div className="sr-note">
              <span aria-hidden="true">↗</span>
              <p>Less searching.<br /><strong>More possibility.</strong></p>
            </div>
          </div>

          <div className="sr-hero-image">
            <img
              src="/images/hero-road.png"
              alt="A dark car on a coastal road at sunset"
              width="1536"
              height="1024"
              fetchpriority="high"
            />
            <div className="sr-image-top">
              <span>01 / THE OPEN ROAD</span>
              <span>A NEW PERSPECTIVE</span>
            </div>
            <div className="sr-image-bottom">
              Your next chapter starts here.
              <small>Illustrative hero image</small>
            </div>
          </div>
        </section>

        <section className="sr-feature-strip" aria-label="Application features">
          <div><span aria-hidden="true">◇</span> Search by make & model</div>
          <div><span aria-hidden="true">◎</span> Clear listed prices</div>
          <div><span aria-hidden="true">↗</span> Connected stock availability</div>
          <div><span aria-hidden="true">＋</span> One simple workspace</div>
        </section>

        <section id="collection" className="sr-section">
          <p className="sr-eyebrow">THE COLLECTION</p>
          <h2>Good choices. <span>Open possibilities.</span></h2>
          <p className="sr-section-description">
            Explore inventory by make, model, category, and price.
          </p>

          <div className="sr-access">
            <div className="sr-access-copy">
              <span className="sr-access-icon" aria-hidden="true">↗</span>
              <div>
                <h3>Your next drive is just around the corner.</h3>
                <p>Sign in or create an account to view current inventory.</p>
              </div>
            </div>
            <button className="sr-button sr-green" onClick={onSignIn}>
              Open the collection <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section id="approach" className="sr-section sr-approach">
          <p className="sr-eyebrow">SIMPLE BY DESIGN</p>
          <h2>Less friction.<br /><span>More forward.</span></h2>

          <div className="sr-steps">
            {[
              ["01", "Make it yours", "Create an account or sign in to your existing one."],
              ["02", "Narrow the search", "Filter inventory by the details that matter to you."],
              ["03", "Check availability", "See listed stock and purchase an available unit."],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sr-closing">
          <div>
            <p className="sr-eyebrow">YOUR NEXT MOVE</p>
            <h2>A different road.<br /><span>A fresh start.</span></h2>
            <p>Your next choice begins with a look at the collection.</p>
            <button className="sr-text-button" onClick={onSignIn}>
              Start exploring <span aria-hidden="true">↗</span>
            </button>
          </div>
          <img
            src="/images/hero-road.png"
            alt="A winding coastal road overlooking the sea"
            loading="lazy"
            width="1536"
            height="1024"
          />
        </section>
      </main>

      <footer className="sr-footer">
        <a href="#top" className="sr-brand">
          <span className="sr-logo">D</span> DriveLedger
        </a>
        <p>Less searching. More possibility.</p>
        <small>Inventory demonstration · No payment processing</small>
      </footer>
    </div>
  );
}
