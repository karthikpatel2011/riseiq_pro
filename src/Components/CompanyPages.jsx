import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer1 from "./Footer1";

const pageLinks = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const posts = [
  {
    category: "Career Playbook",
    date: "06 MIN READ",
    title: "Stop collecting courses. Start building proof.",
    excerpt: "A practical system for turning a crowded learning list into three projects recruiters can actually evaluate.",
    number: "01",
    tone: "orange",
  },
  {
    category: "Interview Room",
    date: "08 MIN READ",
    title: "The quiet work behind confident interviews",
    excerpt: "Confidence is rarely personality. It is preparation with a feedback loop. Here is how to build one.",
    number: "02",
    tone: "blue",
  },
  {
    category: "Student Stories",
    date: "05 MIN READ",
    title: "From no direction to a first product internship",
    excerpt: "A week-by-week look at the small decisions that helped one student stop guessing and start shipping.",
    number: "03",
    tone: "pink",
  },
  {
    category: "Career Playbook",
    date: "07 MIN READ",
    title: "A better way to choose your next skill",
    excerpt: "Use your target role, current evidence, and opportunity window to decide what deserves your time.",
    number: "04",
    tone: "yellow",
  },
  {
    category: "Inside RiseIQ",
    date: "04 MIN READ",
    title: "Why a roadmap should change when you do",
    excerpt: "Static advice expires quickly. We are designing guidance that responds to progress, setbacks, and new ambitions.",
    number: "05",
    tone: "violet",
  },
  {
    category: "Interview Room",
    date: "09 MIN READ",
    title: "How to answer when you do not know the answer",
    excerpt: "A calm framework for showing judgment, curiosity, and structure when an interview question catches you off guard.",
    number: "06",
    tone: "green",
  },
];

const roles = [
  {
    team: "Product",
    title: "Product Designer",
    mode: "Remote / Bengaluru",
    type: "Full-time",
    description: "Shape the way students discover direction. You will work across onboarding, roadmaps, and the small moments that make progress feel real.",
    skills: ["Product thinking", "Figma", "Interaction design"],
  },
  {
    team: "Engineering",
    title: "Frontend Engineer",
    mode: "Remote / Bengaluru",
    type: "Full-time",
    description: "Build fast, expressive interfaces for a career platform that has to feel useful on day one and trustworthy for years.",
    skills: ["React", "CSS craft", "Product judgment"],
  },
  {
    team: "Career Intelligence",
    title: "Career Research Associate",
    mode: "Hybrid / Bengaluru",
    type: "Full-time",
    description: "Translate real hiring patterns into clear career pathways, role maps, and learning milestones for our users.",
    skills: ["Research", "Writing", "Market analysis"],
  },
  {
    team: "Community",
    title: "Student Community Lead",
    mode: "Remote / India",
    type: "Full-time",
    description: "Create programs, conversations, and feedback loops that make students feel seen while helping the product learn faster.",
    skills: ["Community", "Operations", "Storytelling"],
  },
];

function CompanyNav() {
  const navigate = useNavigate();

  return (
    <header className="company-nav">
      <img className="company-nav-logo" src={logo} alt="RiseIQ" onClick={() => navigate("/")} />
      <nav className="company-nav-links" aria-label="Company pages">
        {pageLinks.map((link) => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
      </nav>
      <button className="company-nav-cta" onClick={() => navigate("/signup")}>Start rising</button>
    </header>
  );
}

function CompanyLayout({ children, className = "" }) {
  return (
    <div className={`company-page ${className}`}>
      <CompanyNav />
      {children}
      <Footer1 />
    </div>
  );
}

function Arrow() {
  return <span className="company-arrow" aria-hidden="true">-&gt;</span>;
}

export function AboutPage() {
  return (
    <CompanyLayout className="about-page">
      <main>
        <section className="company-hero about-hero">
          <div className="company-orb company-orb-one" />
          <div className="company-orb company-orb-two" />
          <p className="company-kicker"><span>01</span> ABOUT RISEIQ</p>
          <h1>Careers should not<br /><em>feel like guesswork.</em></h1>
          <p className="company-hero-copy">
            We are building the guide we wish every student had: clear enough to act on,
            personal enough to trust, and alive enough to grow with you.
          </p>
          <Link className="company-primary-btn" to="/signup">Build your roadmap <Arrow /></Link>
          <div className="about-hero-note">SCROLL TO MEET THE IDEA <span /></div>
        </section>

        <section className="about-manifesto">
          <div className="about-sticky-label">THE BELIEF</div>
          <div className="about-manifesto-copy">
            <p>Talent is everywhere.</p>
            <h2>Direction is not.</h2>
            <p className="about-body-copy">
              A student can work incredibly hard and still move in circles. RiseIQ exists
              to turn ambition into an understandable next step, then the next one after that.
            </p>
          </div>
        </section>

        <section className="company-section about-values">
          <p className="company-kicker dark"><span>02</span> HOW WE BUILD</p>
          <div className="company-section-heading">
            <h2>Human judgment.<br /><em>Sharper tools.</em></h2>
            <p>No vague motivation posters. Every feature should help somebody make a better decision this week.</p>
          </div>
          <div className="about-value-grid">
            {[
              ["01", "Clarity over noise", "We reduce the number of choices until the next useful move becomes obvious."],
              ["02", "Progress over pressure", "A roadmap should create momentum, not become another source of anxiety."],
              ["03", "Proof over promises", "Skills matter when you can show them. We keep the work close to real outcomes."],
              ["04", "People over profiles", "A career is personal. The product should remember that at every step."],
            ].map(([number, title, copy]) => (
              <article className="about-value-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-path">
          <p className="company-kicker"><span>03</span> THE LONG VIEW</p>
          <h2>From first question<br />to giving back.</h2>
          <div className="about-path-line">
            {["Find direction", "Build proof", "Land the role", "Become a mentor"].map((item, index) => (
              <div className="about-path-stop" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </CompanyLayout>
  );
}

export function BlogPage() {
  const [filter, setFilter] = useState("All notes");
  const categories = ["All notes", ...new Set(posts.map((post) => post.category))];
  const visiblePosts = useMemo(
    () => filter === "All notes" ? posts : posts.filter((post) => post.category === filter),
    [filter],
  );

  return (
    <CompanyLayout className="blog-page">
      <main>
        <section className="company-hero blog-hero">
          <p className="company-kicker"><span>02</span> RISEIQ NOTES</p>
          <h1>Useful thoughts for<br /><em>the road ahead.</em></h1>
          <p className="company-hero-copy">Career strategy, interview practice, and honest notes from inside the work.</p>
        </section>

        <section className="blog-board">
          <article className="blog-feature">
            <div className="blog-feature-copy">
              <p className="blog-meta">FEATURED NOTE / CAREER PLAYBOOK</p>
              <h2>Your roadmap needs<br />a finish line.</h2>
              <p>Before another course, another tab, or another saved post: define the proof you want to have in your hands thirty days from now.</p>
              <button className="company-text-btn">Read the note <Arrow /></button>
            </div>
            <div className="blog-feature-mark">
              <span>R</span>
              <small>FIELD NOTE<br />VOL. 01</small>
            </div>
          </article>

          <div className="blog-filter-row" aria-label="Filter blog posts">
            {categories.map((category) => (
              <button
                key={category}
                className={filter === category ? "is-active" : ""}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="blog-grid">
            {visiblePosts.map((post) => (
              <article className={`blog-card blog-card-${post.tone}`} key={post.number}>
                <div className="blog-card-top">
                  <span>{post.number}</span>
                  <small>{post.date}</small>
                </div>
                <p className="blog-meta">{post.category}</p>
                <h3>{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <button className="blog-read-btn" aria-label={`Read ${post.title}`}><Arrow /></button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </CompanyLayout>
  );
}

export function CareersPage() {
  const [openRole, setOpenRole] = useState(0);

  return (
    <CompanyLayout className="careers-page">
      <main>
        <section className="company-hero careers-hero">
          <div className="careers-stamp">BUILD WITH<br /><strong>CARE</strong></div>
          <p className="company-kicker"><span>03</span> JOIN THE TEAM</p>
          <h1>Make direction<br /><em>feel possible.</em></h1>
          <p className="company-hero-copy">Small team. Large problem. Thoughtful work for the people figuring out what comes next.</p>
          <a className="company-primary-btn" href="#open-roles">See open roles <Arrow /></a>
        </section>

        <section className="careers-culture">
          <p className="company-kicker dark"><span>01</span> WORKING HERE</p>
          <div className="careers-culture-grid">
            <h2>We take the work seriously.<br /><em>Ourselves, less so.</em></h2>
            <div className="careers-culture-points">
              {[
                ["01", "Own the outcome", "You will have room to make decisions and the responsibility to learn from them."],
                ["02", "Stay close to users", "Good ideas get better when they meet the actual day-to-day lives of students."],
                ["03", "Craft is a feature", "We sweat the wording, the loading state, and the final ten percent people can feel."],
              ].map(([number, title, copy]) => (
                <div className="careers-culture-point" key={number}>
                  <span>{number}</span><h3>{title}</h3><p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="careers-roles" id="open-roles">
          <div className="company-section-heading">
            <div>
              <p className="company-kicker"><span>02</span> OPEN ROLES</p>
              <h2>Find your<br /><em>place here.</em></h2>
            </div>
            <p>{roles.length} roles open right now</p>
          </div>
          <div className="careers-role-list">
            {roles.map((role, index) => (
              <article className={`careers-role ${openRole === index ? "is-open" : ""}`} key={role.title}>
                <button className="careers-role-summary" onClick={() => setOpenRole(openRole === index ? -1 : index)}>
                  <span className="careers-role-number">{String(index + 1).padStart(2, "0")}</span>
                  <span><small>{role.team}</small><strong>{role.title}</strong></span>
                  <span className="careers-role-mode">{role.mode}</span>
                  <span className="careers-role-toggle">{openRole === index ? "-" : "+"}</span>
                </button>
                <div className="careers-role-detail">
                  <p>{role.description}</p>
                  <div>{role.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                  <Link to="/contact">Apply for this role <Arrow /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </CompanyLayout>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("Product");

  const submitForm = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <CompanyLayout className="contact-page">
      <main className="contact-main">
        <section className="contact-intro">
          <p className="company-kicker"><span>04</span> CONTACT RISEIQ</p>
          <h1>Let us talk about<br /><em>your next step.</em></h1>
          <p>Questions, partnerships, ideas, or a role you want to apply for. Send a note. A real person will read it.</p>
          <div className="contact-details">
            <div><small>GENERAL</small><a href="mailto:hello@riseiq.in">hello@riseiq.in</a></div>
            <div><small>PARTNERSHIPS</small><a href="mailto:partners@riseiq.in">partners@riseiq.in</a></div>
            <div><small>BASE</small><span>Bengaluru / working everywhere</span></div>
          </div>
        </section>

        <section className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <span>DONE</span>
              <h2>Your note is with us.</h2>
              <p>Thanks for reaching out. We will get back to you soon.</p>
              <button className="company-text-btn" onClick={() => setSent(false)}>Send another note <Arrow /></button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submitForm}>
              <p className="blog-meta">START A CONVERSATION</p>
              <div className="contact-topic-row">
                {["Product", "Partnership", "Careers", "Other"].map((item) => (
                  <button
                    type="button"
                    className={topic === item ? "is-active" : ""}
                    key={item}
                    onClick={() => setTopic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label><span>Your name</span><input required name="name" placeholder="How should we call you?" /></label>
              <label><span>Email address</span><input required name="email" type="email" placeholder="you@example.com" /></label>
              <label><span>Your note</span><textarea required name="message" rows="5" placeholder="Tell us a little about what is on your mind." /></label>
              <button className="contact-submit" type="submit">Send your note <Arrow /></button>
            </form>
          )}
        </section>
      </main>
    </CompanyLayout>
  );
}
