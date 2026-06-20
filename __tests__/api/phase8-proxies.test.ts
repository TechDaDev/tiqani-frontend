/**
 * Proxy route tests for all 14 Phase 8 endpoints.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const RESOURCES = "/home/zeus3000/PycharmProjects/tiqani-frontend";

describe("Phase 8 proxy routes", () => {
  const contractRoutes = [
    { path: "activate", method: "POST" },
    { path: "complete", method: "POST" },
    { path: "completion-reject", method: "POST" },
    { path: "completion-request", method: "POST" },
    { path: "execution-history", method: "GET" },
    { path: "execution/eligibility", method: "GET" },
    { path: "milestones", methods: ["GET", "POST"] },
    { path: "milestones/reorder", method: "POST" },
  ];

  const milestoneRoutes = [
    { path: "", methods: ["GET", "PATCH"] },
    { path: "start", method: "POST" },
    { path: "submissions", method: "GET" },
    { path: "submit", method: "POST" },
    { path: "approve", method: "POST" },
    { path: "revision", method: "POST" },
  ];

  contractRoutes.forEach((route) => {
    const methods = route.methods || [route.method];
    methods.forEach((method) => {
      it(`contract/${route.path} exports ${method}`, async () => {
        const filePath = `${RESOURCES}/app/api/contracts/[contractId]/${route.path}/route.ts`;
        const mod = await import(filePath);
        expect(mod[method]).toBeDefined();
        expect(typeof mod[method]).toBe("function");
      });
    });
  });

  milestoneRoutes.forEach((route) => {
    const methods = route.methods || [route.method];
    methods.forEach((method) => {
      const routePath = route.path ? `/${route.path}` : "";
      it(`milestones/{id}${routePath} exports ${method}`, async () => {
        const filePath = `${RESOURCES}/app/api/milestones/[milestoneId]${routePath}/route.ts`;
        const mod = await import(filePath);
        expect(mod[method]).toBeDefined();
        expect(typeof mod[method]).toBe("function");
      });
    });
  });
});

describe("Milestone proxy backend paths", () => {
  it("use /api/contracts/milestones/ prefix (not /api/milestones/)", () => {
    // The routes were fixed via sed - verified by grep at creation time
    // This test checks the source files directly
    const path = "/home/zeus3000/PycharmProjects/tiqani-frontend";
    const fs = require("fs");
    const routeFiles = [
      "app/api/milestones/[milestoneId]/route.ts",
      "app/api/milestones/[milestoneId]/start/route.ts",
      "app/api/milestones/[milestoneId]/submit/route.ts",
      "app/api/milestones/[milestoneId]/submissions/route.ts",
      "app/api/milestones/[milestoneId]/revision/route.ts",
      "app/api/milestones/[milestoneId]/approve/route.ts",
    ];
    for (const file of routeFiles) {
      const content = fs.readFileSync(`${path}/${file}`, "utf-8");
      expect(content).not.toContain("/api/milestones/");
      expect(content).toContain("/api/contracts/milestones/");
    }
  });
});
