"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site.config";
import s from "./Nav.module.css";

const ROUTES = [
  { href: "/work", label: "Work" },
  { href: "/film", label: "Film" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header className={s.bar}>
      <Link href="/" className={s.mark} aria-label={`${site.name} — home`}>
        {site.name}
      </Link>
      <nav className={s.links} aria-label="Main">
        {ROUTES.map((r) => {
          const active = path === r.href || path.startsWith(`${r.href}/`);
          return (
            <Link
              key={r.href}
              href={r.href}
              className={`${s.link} ${active ? s.current : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {r.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
