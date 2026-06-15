"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { MapPin, Star, BadgeCheck, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Link } from "@/lib/i18n/navigation";
import { type Locale } from "@/lib/i18n/routing";

type TechnicianPreview = {
  id: number;
  name: string;
  title: string;
  location: string;
  rating: number;
  isVerified: boolean;
  isAvailable: boolean;
  skills: string[];
  initials: string;
};

const devTechnicians: TechnicianPreview[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    title: "Network Engineer",
    location: "Baghdad",
    rating: 4.8,
    isVerified: true,
    isAvailable: true,
    skills: ["Networking", "Security"],
    initials: "AH",
  },
  {
    id: 2,
    name: "Sara Mahmoud",
    title: "Software Developer",
    location: "Erbil",
    rating: 4.9,
    isVerified: true,
    isAvailable: true,
    skills: ["Web Dev", "Mobile"],
    initials: "SM",
  },
  {
    id: 3,
    name: "Karim Ali",
    title: "Cybersecurity Specialist",
    location: "Basra",
    rating: 4.7,
    isVerified: true,
    isAvailable: false,
    skills: ["Security", "Audit"],
    initials: "KA",
  },
];

const NOTE = "Development-only preview data. Replace with API integration.";

export function TechnicianPreviewSection() {
  const t = useTranslations("technicians");
  const params = useParams();
  const locale = (params.locale as Locale) || "en";

  return (
    <section id="technicians" className="py-16 sm:py-24">
      <ResponsiveContainer>
        <SectionHeading title={t("title")} description={t("description")} />

        {/* Development-only notice */}
        <div className="mt-4 text-center">
          <span className="inline-block rounded-full bg-warning-soft px-3 py-1 text-xs text-warning">
            {NOTE}
          </span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devTechnicians.map((tech) => (
            <Card key={tech.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                      {tech.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold">{tech.name}</h3>
                        {tech.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-primary" aria-label={t("verified")} />
                        )}
                      </div>
                      <p className="text-sm text-foreground-muted">
                        {tech.title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {tech.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-warning" />
                    {tech.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {tech.isAvailable ? t("available") : t("busy")}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tech.skills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-t border-border bg-surface-subtle/50 p-4">
                <Link
                  href={`/technicians/${tech.id}`}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    {t("viewProfile")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
