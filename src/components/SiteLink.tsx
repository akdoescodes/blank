import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Scrolls to a homepage section, routing back to "/" first when the visitor is
 * on another page (so "Services" still works from /careers).
 */
export function useGoToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (to: string) => {
    const id = to.replace(/^#/, '');

    if (id === 'top') {
      if (pathname !== '/') navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (pathname !== '/') navigate('/', { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** "/route" navigates; "#section" scrolls (routing home first if needed). */
  to: string;
  children: ReactNode;
};

/** One link component for both routes and in-page sections. */
export default function SiteLink({ to, children, onClick, ...rest }: Props) {
  const goToSection = useGoToSection();

  if (to.startsWith('/')) {
    return (
      <Link to={to} onClick={onClick as never} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={to}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        goToSection(to);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
