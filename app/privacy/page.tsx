import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy — Louie Harrington Photography",
  description: "How booking enquiry details are used by Louie Harrington Photography.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <Link className="privacy-page__back" href="/">← Back to the portfolio</Link>
      <p className="eyebrow">Booking enquiries</p>
      <h1>Privacy details</h1>
      <p className="privacy-page__lead">The booking form collects only what is needed to understand and reply to a photography enquiry.</p>

      <section>
        <h2>What is collected</h2>
        <div>
          <p>Your name, email address, chosen service, optional date and location, and the request you write.</p>
          <p>Do not include passwords, payment-card information or sensitive personal details.</p>
        </div>
      </section>

      <section>
        <h2>How it is used</h2>
        <div>
          <p>The details are used only to read the enquiry, prepare a quote and reply to you. They are not sold or used for marketing lists.</p>
          <p>Booking requests should be made or approved by an adult.</p>
        </div>
      </section>

      <section>
        <h2>Form delivery</h2>
        <div>
          <p>The site sends enquiries through Web3Forms for email delivery. Web3Forms processes submissions under its own privacy terms.</p>
          <p><a href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">Read Web3Forms&apos; privacy information ↗</a></p>
        </div>
      </section>

      <section>
        <h2>Questions or deletion</h2>
        <div>
          <p>Use the Instagram link on the portfolio to ask about an enquiry or request deletion. This page deliberately does not publish Louie&apos;s private email address.</p>
        </div>
      </section>
    </main>
  );
}
