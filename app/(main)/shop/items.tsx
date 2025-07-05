"use client";

import { useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
import { Heart, Zap } from "lucide-react";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  onUpgrade: () => void;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
  onUpgrade,
}: ItemsProps) => {
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts().catch(() => toast.error("Something went wrong."));
    });
  };

  const onUpgradeClick = () => {
    toast.loading("Redirecting to checkout...");
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) window.location.href = response.data;
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <ul className="mx-auto flex w-full max-w-[400px] flex-col gap-y-4">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/heart.svg" alt="Heart" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Cœurs
          </p>
        </div>

        <Button onClick={onRefillHearts} disabled={pending} aria-disabled={pending}>
          {hearts} / 5
        </Button>
      </div>

      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/points.svg" alt="Points" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Points
          </p>
        </div>

        <Button onClick={openPracticeModal} disabled={pending} aria-disabled={pending}>
          {points}
        </Button>
      </div>

      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Cœurs illimités
          </p>
        </div>

        <Button onClick={onUpgrade} disabled={pending} aria-disabled={pending}>
          {hasActiveSubscription ? "Paramètres" : "Améliorer"}
        </Button>
      </div>
    </ul>
  );
};
