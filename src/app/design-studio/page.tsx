"use client";

import dynamic from "next/dynamic";

const ProductCustomizer = dynamic(
  () => import("@/components/ProductCustomizer"),
  { ssr: false }
);

export default function DesignStudioPage() {
  return (
    <div className="min-h-screen bg-tropical-cream">
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-8 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-playfair text-2xl font-bold text-brand-pink">
            Island Gyal™ <span className="text-navy-900 font-light ml-2">Design Studio</span>
          </h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-navy-900 hover:text-brand-pink transition-colors">
            Back to Shop
          </a>
        </nav>
      </header>
      <main>
        <ProductCustomizer />
      </main>
    </div>
  );
}
