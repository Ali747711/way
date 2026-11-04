import Link from 'next/link';

export default function NoSet({ message }: { message: string }) {
  return (
    <main className="mx-auto w-full max-w-160 space-y-3 px-4 pt-10 pb-16 sm:pt-16">
      <p className="text-3xl leading-tight font-semibold tracking-tight text-balance">
        {message}
      </p>
      <Link
        href="/about"
        className="inline-flex min-h-11 items-center text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        About Way
      </Link>
    </main>
  );
}
