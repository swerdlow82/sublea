export const FAQ = () => {
    const faqs = [
        {
            question: "Why do I have to be verified?",
            answer: "We verify all users to maintain a safe, trusted community. This helps prevent scams, verify identities, and ensure a secure environment for subleasing."
        },
        {
            question: "Do you deal with payments?",
            answer: "Currently, we do not handle payments directly on the platform. We connect listers and subtenants directly, allowing them to arrange rent and security deposit payments through their preferred and secure methods."
        },
        {
            question: "How can I post a listing?",
            answer: "You can post a listing by registering for an account, completing your profile, and clicking the 'Post a Listing' button. Make sure to provide detailed information and high-quality photos for the best results!"
        }
    ];

    return (
        <section id="faq" className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 scroll-mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <details key={index} className="group border border-gray-200 rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                            <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                            <span className="shrink-0 transition duration-300 group-open:-rotate-180 bg-white p-1.5 rounded-full border border-gray-200 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-gray-600">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
};
