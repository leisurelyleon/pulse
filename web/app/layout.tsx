import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { ThemeProvider } from "@/lib/hooks/useTheme";
import "./globals.css";

// next/font/google self-hosts these into the build output at build time:
// no runtime CDN request, no layout shift. It injects the CSS variables that
// globals.css and tailwind.config.ts reference.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "pulse — real-time analytics, streamed live",
  description:
    "A single-page analytics dashboard streaming live metrics over a WebSocket from a Rust service, rendered with hand-drawn SVG charts, animated count-ups, and live filters.",
  openGraph: {
    title: "pulse",
    description:
      "Real-time metrics streamed over a WebSocket from a Rust backend to a Next.js dashboard.",
    type: "website",
  },
};

// Runs before first paint to set the theme class from storage or system
// preference, eliminating the dark/light flash on load.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("pulse-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${sora.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
