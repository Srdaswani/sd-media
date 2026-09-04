/**
 * Switches the page between the two surfaces named in PROJECT.md.
 *
 * This is a plain server component with a data attribute; globals.css picks it
 * up with `body:has(...)`. No client JavaScript, and the correct colour is in
 * the HTML the server sends — a gallery never flashes apricot before it turns
 * into a darkroom.
 */
export default function Surface({
  tone,
  children,
}: {
  tone: "sky" | "dark";
  children: React.ReactNode;
}) {
  return <div data-surface={tone}>{children}</div>;
}
