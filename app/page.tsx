import Image from "next/image";

export default function Home() {
  return (
    <div className="tw-grid tw-grid-rows-[20px_1fr_20px] tw-items-center tw-justify-items-center tw-min-h-screen tw-p-8 tw-pb-20 tw-gap-16 sm:tw-p-20 tw-font-[family-name:var(--font-geist-sans)]">
      <main className="tw-flex tw-flex-col tw-gap-8 tw-row-start-2 tw-items-center sm:tw-items-start">
        <Image
          className="dark:tw-invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="tw-list-inside tw-list-decimal tw-text-sm tw-text-center sm:tw-text-left tw-font-[family-name:var(--font-geist-mono)]">
          <li className="tw-mb-2">
            Get started by editing{" "}
            <code className="tw-bg-black/[.05] dark:tw-bg-white/[.06] tw-px-1 tw-py-0.5 tw-rounded tw-font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="tw-flex tw-gap-4 tw-items-center tw-flex-col sm:tw-flex-row">
          <a
            className="tw-rounded-full tw-border tw-border-solid tw-border-transparent tw-transition-colors tw-flex tw-items-center tw-justify-center tw-bg-foreground tw-text-background tw-gap-2 hover:tw-bg-[#383838] dark:hover:tw-bg-[#ccc] tw-text-sm sm:tw-text-base tw-h-10 sm:tw-h-12 tw-px-4 sm:tw-px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:tw-invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="tw-rounded-full tw-border tw-border-solid tw-border-black/[.08] dark:tw-border-white/[.145] tw-transition-colors tw-flex tw-items-center tw-justify-center hover:tw-bg-[#f2f2f2] dark:hover:tw-bg-[#1a1a1a] hover:tw-border-transparent tw-text-sm sm:tw-text-base tw-h-10 sm:tw-h-12 tw-px-4 sm:tw-px-5 sm:tw-min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="tw-row-start-3 tw-flex tw-gap-6 tw-flex-wrap tw-items-center tw-justify-center">
        <a
          className="tw-flex tw-items-center tw-gap-2 hover:tw-underline hover:tw-underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="tw-flex tw-items-center tw-gap-2 hover:tw-underline hover:tw-underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="tw-flex tw-items-center tw-gap-2 hover:tw-underline hover:tw-underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
