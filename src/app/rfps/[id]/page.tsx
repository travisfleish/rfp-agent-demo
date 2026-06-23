import { RfpDetailPage } from "@/components/pages/rfp-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RfpDetailPage id={id} />;
}
