"use client";

import { useMemo, useState } from "react";

import { SubjectCard, type SubjectCardProps } from "@/components/cards/SubjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterGroup, FilterPill } from "@/components/ui/FilterPill";
import type { SubjectCategory } from "@/config/constants";

const ALL = "all";

/**
 * Subjects index with category filtering.
 *
 * Card props are built on the server and passed down flat, so this component
 * only owns the filter state — the centre configuration never reaches the
 * browser.
 */
export function SubjectExplorer({
  cards,
  categories,
}: {
  cards: SubjectCardProps[];
  categories: { id: SubjectCategory; label: string }[];
}) {
  const [category, setCategory] = useState<string>(ALL);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const card of cards) {
      map.set(card.subject.category, (map.get(card.subject.category) ?? 0) + 1);
    }
    return map;
  }, [cards]);

  const visible = useMemo(
    () =>
      category === ALL
        ? cards
        : cards.filter((card) => card.subject.category === category),
    [cards, category],
  );

  return (
    <div className="flex flex-col gap-8">
      {categories.length > 1 ? (
        <FilterGroup label="Filter by category" scroll>
          <FilterPill
            label="All subjects"
            count={cards.length}
            selected={category === ALL}
            onSelect={() => setCategory(ALL)}
          />
          {categories.map((item) => (
            <FilterPill
              key={item.id}
              label={item.label}
              count={counts.get(item.id) ?? 0}
              selected={category === item.id}
              onSelect={() => setCategory(item.id)}
            />
          ))}
        </FilterGroup>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} of {cards.length} subjects
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon="bookOpen"
          title="No subjects in this category yet"
          description="Try another category, or message us — we may be able to arrange it."
        />
      ) : (
        <ul className="grid gap-5">
          {visible.map((card, index) => (
            <li key={card.subject.slug}>
              <SubjectCard {...card} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
