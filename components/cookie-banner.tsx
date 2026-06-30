"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          我们使用 Cookie 来优化您的浏览体验。阅读我们的{" "}
          <Link href="/privacy-policy" className="text-blue-600 underline">
            隐私政策
          </Link>
          。
        </p>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            拒绝
          </button>
          <button
            onClick={accept}
            className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            接受
          </button>
        </div>
      </div>
    </div>
  );
}
