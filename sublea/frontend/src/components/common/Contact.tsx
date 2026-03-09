import React from 'react';

export const Contact = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 min-h-[70vh] flex items-center justify-center">
      <div className="glass-panel p-8 md:p-12 text-center shadow-xl border border-[var(--border)] rounded-3xl relative overflow-hidden w-full bg-[var(--surface)]/80 backdrop-blur-xl">
        {/* Decorative background gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)] opacity-[0.15] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)] opacity-[0.1] blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)] mb-6">
            Get in touch
          </h1>
          
          <div className="mx-auto max-w-xl text-lg text-[var(--text-muted)] space-y-6">
            <p className="leading-relaxed">
              Sublea is making student housing simple, verified, and secure. We believe finding a sublet shouldn't be stressful, which is why we’ve built a marketplace designed specifically for students.
            </p>
            <p className="leading-relaxed">
              Whether you have a question, feature request, or need help with a listing, we're here for you. We read every email.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            <a
              href="mailto:support@sublea.com"
              className="btn btn-primary px-8 py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Email support@sublea.com
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <p className="text-sm text-[var(--text-muted)] mt-4">
              We typically reply within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
