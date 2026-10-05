"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ArrowLeft } from "lucide-react";

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${slug}`);
      const json = await res.json();
      if (json.success) {
        setPage(json.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center pt-32 pb-20 text-center px-4">
          <h1 className="text-4xl font-black mb-4">Page Not Found</h1>
          <p className="text-gray-500 mb-6">The page you are looking for does not exist or has been removed.</p>
          <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold hover:underline">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{page.title}</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">{page.title}</h1>

          {/* Page Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Last Updated */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
            Last updated: {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
