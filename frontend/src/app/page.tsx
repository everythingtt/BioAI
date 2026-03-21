"use client";

import { useBioStore } from "@/store/bioStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn } = useBioStore();

  useEffect(() => {
    if (isLoggedIn) {
      redirect("/lab");
    } else {
      redirect("/hub");
    }
  }, [isLoggedIn]);

  return null;
}
