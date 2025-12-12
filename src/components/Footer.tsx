import * as React from 'react';

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <footer ref={ref} className="w-full py-6 text-center" {...props}>
        <p className="text-white/60 text-sm">
          © 2025 HararAI by Alexander Getahun Tadese. All rights reserved.
        </p>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
