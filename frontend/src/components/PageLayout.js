import React from 'react';

function PageLayout({ children, pageName }) {
  return (
    <div className="page-layout">
      <nav className="nav-top">
        <span className="nav-brand">Exam Committee Proposal</span>
        <span className="nav-separator">|</span>
        <span className="nav-page">{pageName}</span>
      </nav>

      <main className="page-content">{children}</main>

      <nav className="nav-bottom">
        <span>© {new Date().getFullYear()} Shamim Mahamud Shajon. All rights reserved.</span>
      </nav>
    </div>
  );
}

export default PageLayout;
