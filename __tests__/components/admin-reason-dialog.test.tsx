import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";

describe("AdminReasonDialog", () => {
  it("requires reason before confirming", async () => {
    const onConfirm = vi.fn();
    render(
      <AdminReasonDialog
        label="Suspend"
        title="Suspend user"
        confirmLabel="Suspend"
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Suspend" }).at(-1)!);
    expect(await screen.findByText("Reason required.")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("submits trimmed reason", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <AdminReasonDialog
        label="Restore"
        title="Restore user"
        confirmLabel="Restore"
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Restore" }));
    fireEvent.change(screen.getByLabelText("Reason"), { target: { value: "  Appeal accepted  " } });
    fireEvent.click(screen.getAllByRole("button", { name: "Restore" }).at(-1)!);
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith("Appeal accepted"));
  });

  it("exposes accessible dialog semantics", () => {
    render(
      <AdminReasonDialog
        label="Approve"
        title="Approve technician"
        confirmLabel="Approve"
        onConfirm={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(screen.getByRole("dialog", { name: "Approve technician" })).toBeInTheDocument();
    expect(screen.getByLabelText("Reason")).toBeInTheDocument();
  });
});
