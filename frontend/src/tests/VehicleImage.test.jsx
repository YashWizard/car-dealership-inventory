import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VehicleImage from "../components/VehicleImage";

describe("VehicleImage", () => {
  it("renders a representative vehicle photo", () => {
    render(<VehicleImage identity="Honda City" />);

    expect(
      screen.getByRole("img", {
        name: /representative car photograph/i,
      }),
    ).toBeInTheDocument();
  });

  it("uses eager loading for the hero photograph", () => {
    render(<VehicleImage hero />);

    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });

  it("falls back to SVG when the photo fails", () => {
    const { container } = render(
      <VehicleImage identity="Honda City" />,
    );

    fireEvent.error(screen.getByRole("img"));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
