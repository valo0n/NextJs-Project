import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
  it("shfaq tekstin e fëmijëve", () => {
    render(<Button>Kliko këtu</Button>);
    expect(screen.getByText("Kliko këtu")).toBeInTheDocument();
  });

  it("thërret onClick kur klikohet", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Dërgo</Button>);
    fireEvent.click(screen.getByText("Dërgo"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("është i çaktivizuar kur disabled=true", () => {
    render(<Button disabled>Dërgo</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
