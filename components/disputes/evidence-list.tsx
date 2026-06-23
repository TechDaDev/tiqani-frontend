import type { DisputeEvidence } from "@/lib/disputes/types";

interface Props {
  items: DisputeEvidence[];
}

export function EvidenceList({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">{item.evidence_type}</span>
              <p className="text-sm mt-1">{item.file ? <a href={item.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.file.split("/").pop()}</a> : item.description}</p>
            </div>
            <p className="text-xs text-gray-500">{item.submitted_by_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
