import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

const product = {
  _id: "abc123",
  name: "Logitech G Pro X",
  price: 223,
  image: "https://example.com/x.jpg",
};

describe("Card", () => {
  it("shfaq emrin dhe çmimin e produktit", () => {
    render(<Card product={product} />);
    expect(screen.getByText("Logitech G Pro X")).toBeInTheDocument();
    expect(screen.getByText("$223.00")).toBeInTheDocument();
  });

  it("lidhet me faqen e produktit përmes _id", () => {
    render(<Card product={product} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/shop/abc123");
  });
});
