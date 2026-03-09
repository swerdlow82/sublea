import { useState } from 'react';

export const HelpCenter = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: "getting-started",
      title: "1. Getting Started",
      items: [
        { q: "What is Sublea?", a: "Sublea is a student-exclusive subleasing platform designed to help verified university students find or post housing opportunities safely." },
        { q: "Who can use Sublea?", a: "Currently, Sublea requires a valid University of Oregon (.edu) email address, but we intend to expand to other universities soon." },
        { q: "How do I create an account?", a: "Click 'Sign Up' and provide your student email along with some basic details like your age and gender preferences." },
        { q: "How do I verify my student email?", a: "Upon signing up, you will be sent a 6-digit verification code to your .edu email to confirm your account." },
        { q: "How do I reset my password?", a: "Use the 'Forgot Password' link on the login page to request a reset code sent to your email." },
      ]
    },
    {
      id: "browsing-listings",
      title: "2. Browsing Listings",
      items: [
        { q: "How do I search for a sublet?", a: "Navigate to the Browse page. You can search by address using the search bar, or use the interactive map to explore areas." },
        { q: "What do the bedroom/bathroom counts mean?", a: "They indicate the total number of bedrooms and bathrooms available in the sublease space." },
        { q: "How do I filter by dates or price?", a: "Use the filter options on the left side of the Browse page to only see places that match your budget and date requirements." },
        { q: "What does 'anonymous listing' mean?", a: "Some listers choose to hide their name publicly to respect their privacy. You can still message them securely through the platform." }
      ]
    },
    {
      id: "posting-listing",
      title: "3. Posting a Listing",
      items: [
        { q: "How do I create a listing?", a: "Click the 'Post Listing' button, fill in the address, price, dates, describe your place, and upload a few clear photos." },
        { q: "Can I post anonymously?", a: "Yes. In the listing creation form, you simply toggle 'Post Anonymously'. Your name will be hidden from the public listing." },
        { q: "What are roommate preference fields?", a: "To help you find the best fit, you can specify lifestyle preferences such as cleanliness, noise tolerance, smoking, or gender preferences. Note that we do not enforce these, but they help users self-select." },
        { q: "How do I edit or delete my listing?", a: "Go to 'My Listings' in your Dashboard, find the listing, and use the edit or delete options provided." }
      ]
    },
    {
      id: "messaging",
      title: "4. Messaging & Connecting",
      items: [
        { q: "How do I contact a lister?", a: "On any listing details page, use the 'Message Lister' button to send a direct message via our internal system." },
        { q: "Can listers see my profile?", a: "When you message someone, they will be able to view your profile details, which aids in finding compatible roommates." }
      ]
    },
    {
      id: "safety-trust",
      title: "5. Safety & Trust",
      items: [
        { q: "How does Sublea verify students?", a: "We strictly require a valid university-issued .edu email to verify that only students can register and access our platform." },
        { q: "What should I watch out for?", a: "Always be cautious if someone asks for payment upfront off-platform before you've seen the lease or space. Listings that seem 'too good to be true' should be approached carefully." },
        { q: "What is Sublea's role?", a: "Sublea simply connects students. We are not a party to any sublease agreement and do not manage properties or handle payments." }
      ]
    },
    {
      id: "account-privacy",
      title: "6. Account & Privacy",
      items: [
        { q: "How do I update my profile?", a: "You can update your profile information in your Account Settings." },
        { q: "How do I delete my account?", a: "Account deletion options are available in your Account Settings. Deleted accounts are soft-deleted from the public view." },
        { q: "How do I contact Sublea?", a: "You can reach out to us at [TBD] for any account or privacy-related questions." }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-[var(--surface)] min-h-screen pt-24 text-[var(--text-main)]">
      <h1 className="text-4xl font-bold mb-8 text-[var(--text-main)] text-center">Help Center</h1>
      <p className="text-[var(--text-muted)] mb-12 text-center max-w-2xl mx-auto">
        Frequently asked questions and guides to help you navigate Sublea safely and efficiently.
      </p>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border border-[var(--border)] rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800">
            <button 
              className="w-full text-left px-6 py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
              onClick={() => toggleSection(section.id)}
            >
              <h2 className="text-xl font-semibold text-[var(--text-main)]">{section.title}</h2>
              <svg 
                className={`w-6 h-6 transform transition-transform ${openSection === section.id ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSection === section.id && (
              <div className="px-6 py-4 space-y-6 bg-white dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200">
                {section.items.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-lg text-[var(--text-main)] mb-2">{item.q}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
