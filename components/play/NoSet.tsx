import Link from 'next/link';

export default function NoSet({ message }: { message: string }) {
  return (
    <main className="mx-auto w-full max-w-160 space-y-4 px-4 py-16">
      <p className="text-xl font-semibold">{message}</p>
      <Link
        href="/about"
        className="inline-block py-2 text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        About Way
      </Link>
    </main>
  );
}
