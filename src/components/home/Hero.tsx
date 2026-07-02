import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="border-b border-gray-200/60 py-16 dark:border-gray-800/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {siteConfig.name}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
