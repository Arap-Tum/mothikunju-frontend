import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Inventory from "@/pages/Inventory";
import { inventoryApi } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  inventoryApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Inventory page", () => {
  beforeEach(() => {
    (inventoryApi.getAll as any).mockResolvedValue({
      data: [
        {
          _id: "1",
          sku: "PNT-001",
          productName: "Paint",
          category: "Chemicals",
          reorderLevel: 10,
          totalQuantity: 25,
          batches: ["B-1"],
        },
      ],
    });
  });

  it("renders inventory list and can create item", async () => {
    render(<Inventory />);

    await waitFor(() => expect(screen.getByText("Inventory List (1)")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("SKU"), { target: { value: "SPR-002" } });
    fireEvent.change(screen.getByLabelText("Product Name"), { target: { value: "Spray" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Tools" } });
    fireEvent.change(screen.getByLabelText("Reorder Level"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Batch Number"), { target: { value: "B-15" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText("Manufacture Date"), { target: { value: "2026-04-01" } });
    fireEvent.change(screen.getByLabelText("Expiry Date"), { target: { value: "2027-04-01" } });
    fireEvent.change(screen.getByLabelText("Storage Location Code"), { target: { value: "A-1-01" } });

    (inventoryApi.create as any).mockResolvedValue({
      data: {
        _id: "2",
        sku: "SPR-002",
        productName: "Spray",
        category: "Tools",
        reorderLevel: 5,
        totalQuantity: 100,
        batches: [{ batchNumber: "B-15", quantity: 100, manufactureDate: "2026-04-01", expiryDate: "2027-04-01", storageLocationCode: "A-1-01" }],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => expect(inventoryApi.create).toHaveBeenCalledWith({
      sku: "SPR-002",
      productName: "Spray",
      category: "Tools",
      reorderLevel: 5,
      batches: [{ batchNumber: "B-15", quantity: 100, manufactureDate: "2026-04-01", expiryDate: "2027-04-01", storageLocationCode: "A-1-01" }],
    }));
  });
});
