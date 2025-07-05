"use client";

import { useState } from "react";

import { Heart, Zap } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: ItemsProps) => {
  const [pending, setPending] = useState(false);
  const { open: openHeartsModal } = useHeartsModal();

  const onUpgradeClick = () => {
    setPending(true);
    // Add upgrade logic here
    setPending(false);
  };

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full items-center gap-x-4 rounded-xl border-2 p-4">
        <Image src="/points.svg" alt="Points" height={60} width={60} />
        <div className="flex-1">
          <p className="text-lg font-bold text-neutral-700">Points</p>
          <p className="text-sm text-muted-foreground">
            Utilisez vos points pour acheter des cœurs
          </p>
        </div>
        <Button
          disabled={pending || points < 50}
          onClick={onUpgradeClick}
          variant="secondary"
          size="sm"
        >
          {points} points
        </Button>
      </div>

      <div className="flex w-full items-center gap-x-4 rounded-xl border-2 p-4">
        <Image src="/heart.svg" alt="Hearts" height={60} width={60} />
        <div className="flex-1">
          <p className="text-lg font-bold text-neutral-700">Cœurs</p>
          <p className="text-sm text-muted-foreground">
            Obtenez des cœurs pour continuer à apprendre
          </p>
        </div>
        <Button
          disabled={pending || hearts >= 5}
          onClick={onUpgradeClick}
          variant="secondary"
          size="sm"
        >
          {hearts}/5
        </Button>
      </div>

      <div className="flex w-full items-center gap-x-4 rounded-xl border-2 p-4">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />
        <div className="flex-1">
          <p className="text-lg font-bold text-neutral-700">Illimité</p>
          <p className="text-sm text-muted-foreground">
            Accès illimité à toutes les leçons
          </p>
        </div>
        <Button
          disabled={pending || hasActiveSubscription}
          onClick={onUpgradeClick}
          variant="secondary"
          size="sm"
        >
          {hasActiveSubscription ? "Actif" : "Acheter"}
        </Button>
      </div>
    </div>
  );
};
