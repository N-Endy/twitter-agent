import { notFound } from "next/navigation";

import { DraftWorkshop } from "@/components/draft-workshop";
import { getDraftWorkshopData } from "@/lib/data";

export default async function DraftWorkshopPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workshop = await getDraftWorkshopData(id);

  if (!workshop) {
    notFound();
  }

  return <DraftWorkshop workshop={workshop} />;
}
