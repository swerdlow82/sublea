export const TermsOfService = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-[var(--surface)] min-h-screen pt-24 text-[var(--text-main)]">
      <h1 className="text-4xl font-bold mb-6 text-[var(--text-main)]">Terms of Service</h1>
      <p className="text-[var(--text-muted)] mb-8">Last Updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          You must be a current student with a valid .edu email address. For our MVP, the platform is tailored for University of Oregon students, but we intend to expand to other universities in the future. You must be at least 16 years of age to register for an account. By using Sublea, you represent and warrant that you meet these eligibility requirements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Account Responsibilities</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          You are responsible for maintaining the confidentiality of your account password, providing accurate contact information, and keeping your listings up to date. You accept responsibility for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Listing Rules</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Listings must represent real, available sublease opportunities. Fraudulent listings, artificially inflated prices, and inaccurate date availabilities are strictly prohibited. While we collect roommate lifestyle preferences to assist matching, you may not post discriminatory requirements that violate Fair Housing laws. You represent that you have the right to sublet the property you are listing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Roommate Preferences & Fair Housing</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea provides filters for roomate preferences such as gender, age range, and lifestyle aspects for user convenience only. These are user-defined filters, and Sublea does not enforce or guarantee these parameters. Users are expected to comply with all applicable local, state, and federal laws regarding housing discrimination, including the Fair Housing Act.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Messaging System and Platform Role</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          We provide a basic messaging system to connect students. Sublea is not a party to any sublease agreement, nor do we act as a broker or property manager. We do not participate in or guarantee any aspect of transactions between users. You assume all responsibility and risk when engaging with other users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Anonymous Listings</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          To protect user privacy, we offer an "anonymous listing" feature. When used, the listing owner's name is hidden from public view, although the listing remains tied to the owner's account internally for platform administration.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Prohibited Conduct</h2>
        <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]">
          <li>Harassment, bullying, or abusive behavior via our messaging system.</li>
          <li>Impersonating another person or entity.</li>
          <li>Posting spam, duplicate listings, or scraping other users' data.</li>
          <li>Violating any laws, including housing anti-discrimination laws.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. User Content</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          By uploading content and photos to Sublea, you grant us a non-exclusive, royalty-free license to use, reproduce, and display that content on our platform. You also represent that you own or have the rights to upload such content without violating third-party rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea reserves the right, at its sole discretion, to suspend or terminate your account and remove any listings if we determine you have violated these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea is provided on an "as is" and "as available" basis. We are not liable for any disputes arising out of sublease agreements, housing conditions, fraudulent activity by other users, or any indirect or consequential damages resulting from your use of the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          These Terms shall be interpreted and governed in accordance with the laws of the State of Oregon, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Changes to these Terms</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea reserves the right to modify these Terms of Service at any time. We will indicate the date of the latest update. Your continued use of the platform constitutes your agreement to the modified Terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          If you have any questions regarding these Terms of Service, please contact us at: <strong>[TBD]</strong>.
        </p>
      </section>
    </div>
  );
};
