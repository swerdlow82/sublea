export const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-[var(--surface)] min-h-screen pt-24 text-[var(--text-main)]">
      <h1 className="text-4xl font-bold mb-6 text-[var(--text-main)]">Privacy Policy</h1>
      <p className="text-[var(--text-muted)] mb-8">Last Updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]">
          <li><strong>Personal Information:</strong> Name, .edu email, age, gender, and gender preference.</li>
          <li><strong>Profile Data:</strong> Bio, profile photo, and lifestyle preferences (cleaning, smoking, pets, drinking, noise, sleep schedule).</li>
          <li><strong>Listing Data:</strong> Address, rent, photos, and availability.</li>
          <li><strong>Platform Activity:</strong> Messages exchanged with other users, IP address, and browser/device information.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use It</h2>
        <p className="text-[var(--text-secondary)] mb-2">We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]">
          <li>Verify your student status using your .edu email address.</li>
          <li>Match students to listings based on their preferences.</li>
          <li>Enable our messaging platform between users.</li>
          <li>Send transactional emails like verifications or password resets.</li>
          <li>Improve the platform and user experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Who We Share It With</h2>
        <p className="text-[var(--text-secondary)] mb-2">
          Sublea does not sell your personal data to advertisers. We share information with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]">
          <li><strong>Other Registered Users:</strong> Your profile information and listing details.</li>
          <li><strong>Third-Party Services:</strong> We use third parties to deliver emails, host images, and provide mapping capabilities.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Anonymous Listings</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Through our anonymous listing feature, you can choose to hide your name on a listing. However, your account remains internally linked to the listing to ensure accountability and enable communication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Age and Student Restriction</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea is currently restricted to verified University of Oregon students, with plans to expand to other universities. You must have a valid .edu email address to register. Sublea collects age data to help users find suitable roommates; you must be at least 16 years old to use the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          If you delete your account or a listing, the data will be soft-deleted. It will no longer be visible to other users, but may be retained in our backups or in compliance with legal obligations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          You have the right to request access to your data, corrections, or account deletion. To exercise any of these rights, please contact us at the email provided below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Cookies & Tracking</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Sublea stores JWT tokens in your browser to maintain your login session. We may also use anonymous analytics tools in the future to improve platform operations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          If you have any questions regarding this Privacy Policy, please contact us at: <strong>[TBD]</strong>.
        </p>
      </section>
    </div>
  );
};
