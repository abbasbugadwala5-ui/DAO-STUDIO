"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

type IndustryCard = {
  name: string;
  copy: string;
};

const INDUSTRY_CARDS: IndustryCard[] = [
  { name: "Healthcare", copy: "Trust-led campaigns for providers, patient education, and care brands that need clarity before conversion." },
  { name: "Hospitals & Clinics", copy: "Patient acquisition, service-line awareness, and local visibility systems built around credibility and speed." },
  { name: "Construction", copy: "Project stories, tender-ready positioning, and lead generation for contractors building real-world momentum." },
  { name: "Interior Design", copy: "Visual-first content, portfolio storytelling, and premium enquiries for studios with a distinct design eye." },
  { name: "Architecture", copy: "Brand systems and project narratives that make technical excellence legible to clients, developers, and partners." },
  { name: "Restaurants & Cafes", copy: "Menus, launches, reels, and local discovery loops that turn attention into tables and repeat visits." },
  { name: "Hotels & Hospitality", copy: "Booking-focused content, destination storytelling, and guest journeys that feel premium from first impression." },
  { name: "Luxury Brands", copy: "Quietly confident positioning, art direction, and campaigns for audiences who notice every detail." },
  { name: "Fashion & Apparel", copy: "Drops, lookbooks, creator content, and retention flows designed to move browsers into loyal buyers." },
  { name: "Beauty & Cosmetics", copy: "Product storytelling, tutorials, and social proof systems that make formulas, shades, and results irresistible." },
  { name: "Fitness & Gyms", copy: "Membership campaigns, transformation stories, and local lead funnels that keep classes and trainers visible." },
  { name: "Education", copy: "Enrollment-grade campaigns plus brand work that earns trust with parents, students, and faculty." },
  { name: "E-Learning", copy: "Course launches, learner funnels, and authority content that turn expertise into structured demand." },
  { name: "Corporate Businesses", copy: "Clear corporate messaging, recruitment support, and reputation systems for teams that need consistency." },
  { name: "Startups", copy: "Positioning, launch assets, and growth experiments for teams moving fast without losing strategic focus." },
  { name: "Automotive", copy: "Showroom traffic, test-drive leads, and digital-first launches for OEMs, dealers, and specialists." },
  { name: "Travel & Tourism", copy: "Destination stories, itinerary campaigns, and booking funnels built for discovery, desire, and action." },
  { name: "Event Management", copy: "Launch buzz, sponsor value, and attendee conversion systems for events that need a full room." },
  { name: "Finance & Banking", copy: "Compliant, credible, and not boring. Brand and demand systems for financial products and institutions." },
  { name: "Insurance", copy: "Plain-language campaigns and trust-first journeys that make protection easier to understand and choose." },
  { name: "Law Firms", copy: "Authority content, practice-area visibility, and client acquisition that respects the seriousness of the work." },
  { name: "Retail Stores", copy: "Local traffic, seasonal campaigns, and loyalty loops that connect shelves, staff, and social channels." },
  { name: "Jewelry Brands", copy: "Detail-rich visuals, collection launches, and luxury cues that make craftsmanship feel instantly valuable." },
  { name: "Furniture & Home Decor", copy: "Room-led storytelling, catalog campaigns, and purchase journeys for pieces people imagine living with." },
  { name: "Technology Companies", copy: "Product clarity, demand generation, and technical storytelling for teams selling complex innovation." },
  { name: "SaaS Platforms", copy: "Positioning, onboarding content, and pipeline programs for subscription products with measurable growth goals." },
  { name: "IT Services", copy: "Trust-building campaigns, solution pages, and B2B funnels for teams that solve invisible problems." },
  { name: "AI & Tech Startups", copy: "Sharp messaging, demo-led content, and category creation for products people need to understand fast." },
  { name: "Photography Studios", copy: "Portfolio positioning, booking funnels, and visual identity for studios selling taste and reliability." },
  { name: "Influencers & Personal Brands", copy: "Platform strategy, offer design, and content systems that turn visibility into durable value." },
  { name: "NGOs & Nonprofits", copy: "Mission clarity, donor journeys, and campaign storytelling that moves people from awareness to support." },
  { name: "Government Projects", copy: "Accessible public communication, stakeholder trust, and civic campaigns built with clarity and care." },
  { name: "Sports & Athletics", copy: "Fan engagement, athlete stories, and sponsorship-ready content for teams, clubs, and performance brands." },
  { name: "Food & Beverage", copy: "Branding and content that travels from menu to feed to shelf, built to make people hungry." },
  { name: "Pet Care", copy: "Warm, trust-led campaigns for clinics, grooming, retail, and services people choose with care." },
  { name: "Dental Clinics", copy: "Treatment education, local SEO, and appointment funnels that make confidence feel approachable." },
  { name: "Medical Tourism", copy: "Trust-building journeys, destination reassurance, and multilingual lead flows for high-consideration care." },
  { name: "Recruitment Agencies", copy: "Employer branding, candidate pipelines, and B2B campaigns that make hiring expertise visible." },
  { name: "HR & Consulting Firms", copy: "Thought leadership, service packaging, and lead generation for advisory teams selling judgment." },
  { name: "Crypto & Web3", copy: "Community growth, product clarity, and credibility signals for markets that move quickly." },
  { name: "Gaming & Esports", copy: "Community-first campaigns, launch content, and sponsorship assets for players, teams, and platforms." },
  { name: "Renewable Energy", copy: "Impact-led positioning, project storytelling, and B2B demand for cleaner infrastructure and technology." },
  { name: "Security Services", copy: "Trust, response, and reliability messaging for teams protecting people, places, and operations." },
  { name: "Aviation", copy: "Premium communication, service marketing, and operational credibility for aviation brands and suppliers." },
  { name: "Marine & Yacht Services", copy: "Luxury service storytelling, destination content, and owner-focused lead journeys for marine businesses." },
  { name: "Wedding & Luxury Events", copy: "Emotion-rich visuals, vendor credibility, and premium enquiry funnels for once-in-a-lifetime moments." },
  { name: "Pharmaceutical Companies", copy: "Compliant communication, product education, and stakeholder campaigns built around precision and trust." },
  { name: "Educational Institutions", copy: "Admissions storytelling, parent trust, and campus identity systems for schools, colleges, and academies." },
  { name: "Property Management", copy: "Owner acquisition, tenant communication, and service credibility for portfolios that need confidence." },
  { name: "Cleaning Services", copy: "Local lead generation, proof-led content, and service packages that make reliability easy to buy." },
  { name: "Home Services", copy: "Search visibility, review systems, and booking funnels for businesses people need close to home." },
  { name: "Printing & Advertising", copy: "Portfolio clarity, B2B outreach, and campaign support for production teams behind visible brands." },
  { name: "Industrial Companies", copy: "Technical positioning, facility storytelling, and sales assets for serious buyers and long cycles." },
  { name: "Franchise Businesses", copy: "Brand consistency, location launches, and franchisee marketing systems that scale without drifting." },
  { name: "Mobile Apps & Platforms", copy: "Launch strategy, app-store storytelling, and user acquisition loops for products people keep using." },
  { name: "Luxury Real Estate", copy: "Cinematic listings, investor journeys, and prestige-led campaigns for high-value property." },
  { name: "Smart Home Companies", copy: "Experience-led content, demo journeys, and premium positioning for connected living products." },
  { name: "Blockchain Companies", copy: "Category clarity, community education, and credibility layers for decentralized products and protocols." },
  { name: "Fintech Startups", copy: "Trust, product adoption, and growth systems for financial tools entering crowded markets." },
  { name: "Creative Agencies", copy: "Positioning, case studies, and lead systems for teams selling originality and execution." },
  { name: "Digital Products", copy: "Product launches, conversion flows, and customer education for offers that live online." },
  { name: "Consumer Electronics", copy: "Feature storytelling, launch campaigns, and retail-ready assets for devices people compare carefully." },
  { name: "Health & Wellness Brands", copy: "Credible education, community content, and routines that turn wellbeing into repeat engagement." },
  { name: "Baby & Kids Brands", copy: "Gentle, trust-led campaigns for parents making thoughtful choices for children." },
  { name: "Artisan & Handmade Brands", copy: "Origin stories, craft detail, and commerce journeys that make small-batch work feel premium." },
  { name: "Music & Entertainment Brands", copy: "Release campaigns, fan journeys, and identity systems for culture that needs momentum." },
  { name: "Spiritual & Wellness Centers", copy: "Calm, respectful messaging and local discovery systems for experiences built around care." },
  { name: "Agriculture & Farming", copy: "Producer stories, B2B visibility, and sustainability messaging for food, land, and supply chains." },
  { name: "Eco-Friendly Brands", copy: "Proof-led sustainability communication that turns good intentions into believable brand preference." },
  { name: "Cybersecurity Companies", copy: "Risk clarity, technical trust, and demand programs for buyers who cannot afford uncertainty." },
  { name: "Cloud & DevOps Companies", copy: "Technical content, proof-of-capability, and B2B funnels for infrastructure and engineering teams." },
  { name: "Web Development Companies", copy: "Case-study systems, offer clarity, and lead funnels for teams building digital infrastructure." },
  { name: "Marketing & PR Firms", copy: "Authority, differentiation, and pipeline campaigns for agencies that need their own spotlight." },
];

export default function IndustriesSection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const cards = [...INDUSTRY_CARDS, ...INDUSTRY_CARDS.slice(0, 2)];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWithTransition(true);
      setActive((current) => current + 1);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (active !== INDUSTRY_CARDS.length) return;

    const timeout = window.setTimeout(() => {
      setWithTransition(false);
      setActive(0);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [active]);

  useGSAP(
    () => {
      const poseTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setPose(7),
        onEnterBack: () => setPose(7),
      });

      gsap.from(root.current?.querySelectorAll(".find-your-anim") ?? [], {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(root.current?.querySelectorAll(".industry-card") ?? [], {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      return () => {
        poseTrigger.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="industries" className="relative w-full">
      <div className="grid grid-cols-1 tablet:grid-cols-5 gap-12 section-pad max-w-7xl mx-auto w-full">
        <div className="tablet:col-span-2 flex flex-col gap-6 text-ink">
          <span className="supertitle find-your-anim flex items-center gap-1">
            <span className="px-3 py-0.5 bg-gold text-ink leading-none flex items-center">
              Industries
            </span>
            <span className="bg-gold w-2 h-7" />
            <span className="bg-gold w-1 h-7" />
          </span>
          <h2 className="is-h1 find-your-anim flex flex-col text-white">
            <span>Find Your</span>
            <span className="flex items-center gap-4">
              <span className="accent-line text-gold h-[6px] w-[60px] laptop:w-[120px]" />
              <span className="shrink-0 text-gold">Industry</span>
            </span>
          </h2>
          <p className="find-your-anim max-w-[400px] text-ink-mid">
            DAO Studio is built for teams responsible for how brands are seen,
            understood, and chosen across every serious market.
          </p>
          <a
            href="/contact"
            className="find-your-anim mt-2 self-start bg-gold text-ink font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Get Started
          </a>
        </div>

        <div className="tablet:col-span-3 -mr-4 tablet:-mr-8 overflow-hidden relative">
          <div
            className="flex gap-6 pb-6"
            style={{
              transform: `translateX(calc(-${active} * (50% + 12px)))`,
              transition: withTransition
                ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
          >
            {cards.map((industry, i) => (
              <article
                key={`${industry.name}-${i}`}
                className="industry-card diag-card shrink-0"
                style={{
                  flexBasis: "calc((100% - 1.5rem) / 2)",
                  maxWidth: "calc((100% - 1.5rem) / 2)",
                }}
              >
                <div className="flex items-center gap-2 supertitle text-gold">
                  <span>dao</span>
                  <span
                    className="h-[2px] w-12"
                    style={{
                      background:
                        "linear-gradient(to left, #B8975A, transparent)",
                    }}
                  />
                  <span>
                    {String((i % INDUSTRY_CARDS.length) + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="is-h2 text-cream break-words">
                  {industry.name}
                </h3>
                <p
                  className="mt-auto text-sm leading-relaxed text-bone-mid"
                  style={{ textIndent: "2rem" }}
                >
                  {industry.copy}
                </p>
                <div className="absolute bottom-6 right-6 flex items-center gap-[6px]">
                  {Array.from({ length: 7 }).map((_, k) => (
                    <span key={k} className="bg-gold h-5 w-[2px]" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
