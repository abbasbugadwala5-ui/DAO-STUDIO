import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — DAO Studio",
  description: "Start a project with DAO Studio. Dubai, UAE.",
};

export default function ContactPage() {
  return (
    <div className="section-pad max-w-7xl mx-auto w-full pt-32">
      <header className="mb-16 max-w-3xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">Contact</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h1 className="is-h1 mt-6 flex flex-col">
          <span>Tell us about</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span className="text-gold">your brand.</span>
          </span>
        </h1>
        <p className="text-ink-mid mt-8 max-w-2xl">
          We reply within one business day with a clear plan and a fixed-fee
          proposal. No discovery calls billed to your card.
        </p>
      </header>

      <div className="grid grid-cols-1 laptop:grid-cols-3 gap-12">
        <aside className="laptop:col-span-1 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="supertitle text-gold">Email</span>
            <a href="mailto:hello@dao.studio" className="text-ink hover:text-gold">
              hello@dao.studio
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="supertitle text-gold">Studio</span>
            <p className="text-ink">
              Dubai
              <br />
              United Arab Emirates
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="supertitle text-gold">Legal name</span>
            <p className="text-ink-mid text-sm">DAO Marketing Management LLC</p>
          </div>
        </aside>

        <div className="laptop:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
