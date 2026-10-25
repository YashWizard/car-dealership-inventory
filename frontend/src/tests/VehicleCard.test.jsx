import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VehicleCard from "../components/VehicleCard";

const vehicle = {
  id: 1,
  make: "Toyota",
  model: "Corolla",
  category: "Sedan",
  price: "1500000.00",
  quantity: 2,
};

describe("VehicleCard", () => {
  it("displays vehicle identity and stock", () => {
    render(<VehicleCard vehicle={vehicle} />);
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("2 in stock")).toBeInTheDocument();
  });

  it("disables purchasing at zero stock", () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 0 }} />);
    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });

  it("calls the purchase handler", () => {
    const onPurchase = vi.fn();

    render(
      <VehicleCard vehicle={vehicle} onPurchase={onPurchase} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /purchase/i }),
    );

    expect(onPurchase).toHaveBeenCalledWith(vehicle);
  });

  it("hides admin controls from ordinary users", () => {
    render(<VehicleCard vehicle={vehicle} />);

    expect(
      screen.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /restock/i }),
    ).not.toBeInTheDocument();
  });

  it("shows admin controls to admins", () => {
    render(<VehicleCard vehicle={vehicle} isAdmin />);

    expect(
      screen.getByRole("button", { name: /edit/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /delete/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /restock/i }),
    ).toBeInTheDocument();
  });

  it("disables purchasing while a request is running", () => {
    render(<VehicleCard vehicle={vehicle} busy />);

    expect(
      screen.getByRole("button", { name: /purchase/i }),
    ).toBeDisabled();
  });
});
