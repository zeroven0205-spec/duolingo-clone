"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UpdateToast() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleUpdate = () => {
      setIsUpdateAvailable(true);
      toast.success("A new version is available!", {
        description: "Click to refresh and get the latest updates.",
        action: {
          label: "Refresh",
          onClick: () => {
            window.location.reload();
          },
        },
        duration: Infinity,
      });
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleUpdate);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleUpdate
      );
    };
  }, []);

  return null;
}
