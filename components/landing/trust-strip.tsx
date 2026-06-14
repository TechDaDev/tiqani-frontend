import { useTranslations } from "next-intl";
import {
  UserCheck,
  FileSignature,
  Layers,
  ShieldCheck,
  ClipboardCheck,
  Star,
} from "lucide-react";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

const trustItems = [
  { key: "verifiedProfiles", icon: UserCheck },
  { key: "electronicContracts", icon: FileSignature },
  { key: "stageBased", icon: Layers },
  { key: "protectedPayments", icon: ShieldCheck },
  { key: "platformRecorded", icon: ClipboardCheck },
  { key: "transparentRatings", icon: Star },
];

export function TrustStrip() {
  const t = useTranslations("trust");

  return (
    <section className="border-y border-border bg-surface py-8">
      <ResponsiveContainer>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground-muted leading-tight">
                  {t(`${item.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
