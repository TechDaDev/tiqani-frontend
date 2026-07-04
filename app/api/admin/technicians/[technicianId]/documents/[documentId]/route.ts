import { NextRequest, NextResponse } from "next/server";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { serverConfig } from "@/lib/api/server-config";
import { UuidParam } from "@/lib/api/proxy-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ technicianId: string; documentId: string }> }
) {
  const { technicianId, documentId } = await params;
  const parsed = UuidParam.safeParse(technicianId);
  if (!parsed.success) return Response.json({ detail: "Invalid technician id." }, { status: 400 });
  if (documentId !== "identification_documents") {
    return Response.json({ detail: "Invalid document id." }, { status: 400 });
  }

  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  const response = await fetch(
    `${serverConfig.backendInternalUrl}/api/admin/technicians/${parsed.data}/documents/${documentId}/`,
    {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      cache: "no-store",
    }
  );

  const headers = new Headers();
  for (const key of ["content-type", "content-disposition"]) {
    const value = response.headers.get(key);
    if (value) headers.set(key, value);
  }
  headers.set("Cache-Control", "no-store");

  if (!response.ok) {
    const detail = response.status === 404 ? "Document not found." : "Document download failed.";
    return NextResponse.json({ detail }, { status: response.status, headers });
  }

  return new NextResponse(response.body, { status: response.status, headers });
}
