import React from "react";

function Eightcard()
{
    
    const plans = [
        {
          name: "Starter",
          price: "₹0",
          subtitle: "Forever free",
          button: "Get Started Free",
          features: [
            "Verified Skill Profile (up to 5 entries)",
            "5 Doubt posts per month",
            "Basic project co-founder discovery",
            "Placement intel — college-level data",
            "Community feed access",
          ],
        },
        {
          name: "Pro",
          price: "₹299",
          subtitle: "/mo",
          badge: "Most Popular",
          featured: true,
          button: "Get Pro Plan",
          features: [
            "Unlimited Verified Profile entries",
            "Unlimited Doubt posts & answers",
            "Priority co-founder matching",
            "Full placement intelligence access",
            "Skill score analytics dashboard",
            "AI-powered doubt suggestions",
            "Visibility boost on platform",
          ],
        },
        {
          name: "Elite",
          price: "₹699",
          subtitle: "/mo",
          badge: "Best Value",
          button: "Get Elite Plan",
          features: [
            "Everything in Pro",
            "Direct mentor connect (2 sessions/mo)",
            "Recruiter introductions",
            "1:1 profile & skill audit",
            "Custom interview prep based on your profile",
            "Priority placement intel alerts",
            "Priority support",
          ],
        },
      ];

    return(
        <div className="eight">
            <div className="hg"><h1>Invest in Your Profile.<br></br>
           <span className="can"> Cancel Anytime.</span></h1>
           <p>No hidden fees. No lock-in. Start free — upgrade when you're ready to get serious.</p></div>
          <section className="pricing">
  {plans.map((plan, index) => (
    <div
      key={index}
      className={`cord ${plan.featured ? "featured" : ""}`}
    >
      {plan.badge && (
        <div className="badge">
          {plan.badge}
        </div>
      )}

      <h2>{plan.name}</h2>

      <div className="price">
        <span>{plan.price}</span>
        <small>{plan.subtitle}</small>
      </div>

      <ul>
        {plan.features.map((item, i) => (
          <li key={i}>✔ {item}</li>
        ))}
      </ul>

      <button>{plan.button}</button>
    </div>
  ))}
</section>
        </div>
    )
}


export default Eightcard;
