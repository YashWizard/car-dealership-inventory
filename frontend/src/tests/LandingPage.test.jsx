import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingPage from "../pages/LandingPage";

describe("LandingPage", () => {
  it("displays the main heading", () => {
    render(<LandingPage onSignIn={() => {}} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /find your next chapter/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens authentication", () => {
    const onSignIn = vi.fn();
    render(<LandingPage onSignIn={onSignIn} />);
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("links to the collection section", () => {
    render(<LandingPage onSignIn={() => {}} />);
    expect(
      screen.getByRole("link", { name: /explore the collection/i }),
    ).toHaveAttribute("href", "#collection");
    expect(document.getElementById("collection")).toBeInTheDocument();
  });
});
