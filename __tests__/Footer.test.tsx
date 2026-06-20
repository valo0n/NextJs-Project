import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("shfaq seksionet kryesore", () => {
    render(<Footer />);
    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });
});
