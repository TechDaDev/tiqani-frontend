import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechnicianCard } from "@/components/marketplace/TechnicianCard";
import type { TechnicianListItem } from "@/lib/api/marketplace";

// Mock next-intl
vi.mock("next-intl", () => {
  const translations: Record<string, string> = {
    viewProfile: "View profile",
    available: "Available",
    notAvailable: "Unavailable",
    yearsOfExpertise: "8 yrs exp.",
  };
  return {
    useTranslations: () => (key: string) => translations[key] || key,
  };
});

const mockTechnician: TechnicianListItem = {
  user_id: "uuid-test-1",
  username: "testtech",
  full_name: "Test Technician",
  governorate: "Baghdad",
  profile_image: null,
  job_title: "Electrician",
  about: "An experienced electrician with 8 years of work.",
  years_of_expertise: 8,
  is_available: true,
  rate: "4.50",
  is_complete: null,
  incomplete_fields: null,
};

describe("TechnicianCard", () => {
  it("renders technician name and job title", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText("Test Technician")).toBeInTheDocument();
    expect(screen.getByText("Electrician")).toBeInTheDocument();
  });

  it("renders governorate", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText("Baghdad")).toBeInTheDocument();
  });

  it("renders available status indicator", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("renders unavailable status when not available", () => {
    const unavailable = { ...mockTechnician, is_available: false };
    render(<TechnicianCard technician={unavailable} />);
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("renders rating when rate > 0", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("does not render rating when rate is 0", () => {
    const noRate = { ...mockTechnician, rate: "0.00" };
    render(<TechnicianCard technician={noRate} />);
    expect(screen.queryByText("0.0")).not.toBeInTheDocument();
  });

  it("renders about text when present", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText(/experienced electrician/)).toBeInTheDocument();
  });

  it("does not render about when empty", () => {
    const noAbout = { ...mockTechnician, about: null };
    render(<TechnicianCard technician={noAbout} />);
    expect(screen.queryByText(/experienced/)).not.toBeInTheDocument();
  });

  it("links to technician public profile", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/marketplace/technicians/uuid-test-1");
  });

  it("renders initial avatar placeholder when no profile image", () => {
    render(<TechnicianCard technician={mockTechnician} />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
