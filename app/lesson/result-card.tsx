import { InfinityIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { getBoxLabel, type CardBox } from "@/lib/spaced-repetition";

type ResultCardProps = {
  value: number;
  variant: "points" | "hearts";
  /**
   * When provided, shows the spaced-repetition box label (e.g. "Familiar",
   * "Mastered") as a caption under the value. Used to surface the Leitner
   * hierarchy on the post-lesson summary without yet persisting per-word
   * box state — see v2.2.0 plan WIRE-2.
   */
  box?: CardBox;
};

export const ResultCard = ({ value, variant, box }: ResultCardProps) => {
  const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";

  return (
    <div
      className={cn(
        "w-full rounded-2xl border-2",
        variant === "points" && "border-orange-400 bg-orange-400",
        variant === "hearts" && "border-rose-500 bg-rose-500"
      )}
    >
      <div
        className={cn(
          "rounded-t-xl p-1.5 text-center text-xs font-bold uppercase text-white",
          variant === "points" && "bg-orange-400",
          variant === "hearts" && "bg-rose-500"
        )}
      >
        {variant === "hearts" ? "Hears Left" : "Total XP"}
      </div>

      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-white p-6 text-lg font-bold",
          variant === "points" && "text-orange-400",
          variant === "hearts" && "text-rose-500"
        )}
      >
        <Image
          src={imageSrc}
          alt={variant}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value === Infinity ? (
          <InfinityIcon className="h-6 w-6 stroke-[3]" />
        ) : (
          value
        )}
      </div>

      {box !== undefined ? (
        <div className="rounded-b-2xl bg-white px-3 pb-2 pt-1 text-center text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          {getBoxLabel(box)}
        </div>
      ) : null}
    </div>
  );
};
