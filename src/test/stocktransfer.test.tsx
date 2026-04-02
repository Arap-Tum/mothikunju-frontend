import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import StockTransfer from "@/pages/StockTransfer";
import { stockApi } from "@/lib/api";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/lib/api", () => ({
  stockApi: {
    transfer: vi.fn(),
  },
}));

describe("StockTransfer page", () => {
  beforeEach(() => {
    (stockApi.transfer as any).mockResolvedValue({ data: {} });
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  it("performs transfer with valid data", async () => {
    render(
      <MemoryRouter>
        <StockTransfer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("SKU"), { target: { value: "PNT-001" } });
    fireEvent.change(screen.getByLabelText("Source Batch"), { target: { value: "B-001" } });
    fireEvent.change(screen.getByLabelText("Destination Batch"), { target: { value: "B-002" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "10" } });

    fireEvent.click(screen.getByRole("button", { name: /Transfer Stock/i }));

    await waitFor(() => expect(stockApi.transfer).toHaveBeenCalledWith({
      sku: "PNT-001",
      sourceBatch: "B-001",
      destinationBatch: "B-002",
      quantity: 10,
    }));
  });
});
