"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

type FooterProps = {
  disabled?: boolean;
  status: "completed" | "hearts" | "none";
  onCheck: () => void;
  hearts: number;
  percentage: number;
};

export const Footer = ({
  disabled,
  status,
  onCheck,
  hearts,
}: FooterProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  const onPractice = () => {
    startTransition(() => {
      openPracticeModal();
    });
  };

  const onExit = () => {
    startTransition(() => {
      router.push("/learn");
    });
  };

  return (
    <footer className="lg:h-[140px] lg:px-10">
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between gap-x-6 border-t-2 bg-white px-6 py-4 lg:px-0">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <Heart
              fill={hearts > 0 ? "#ef4444" : "#fbbf24"}
              className="h-6 w-6"
            />
            <span className="text-lg font-bold text-slate-500">
              {hearts}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          {status === "completed" && (
            <Button
              disabled={pending}
              onClick={onCheck}
              className="w-full"
              size="lg"
            >
              Continuer
            </Button>
          )}

          {status === "hearts" && (
            <Button
              disabled={pending}
              onClick={openHeartsModal}
              className="w-full"
              size="lg"
            >
              <Heart className="mr-2 h-5 w-5" />
            </Button>
          )}

          {status === "none" && (
            <Button
              disabled={disabled || pending}
              onClick={onCheck}
              className="w-full"
              size="lg"
            >
              Vérifier
            </Button>
          )}

          <Button
            disabled={pending}
            onClick={onPractice}
            variant="ghost"
            size="lg"
          >
            Pratiquer
          </Button>

          <Button
            disabled={pending}
            onClick={onExit}
            variant="ghost"
            size="lg"
          >
            Quitter
          </Button>
        </div>
      </div>
    </footer>
  );
};
