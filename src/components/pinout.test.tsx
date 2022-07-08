import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { act } from "react-dom/test-utils";
import { Bus, HIGH } from "../simulator/chip/chip";
import { Pinout } from "./pinout";

describe("<Pinout />", () => {
  it("renders pins", () => {
    const pin = new Bus("pin");
    render(<Pinout pins={[{ pin }]} />);

    const pinOut = screen.getByText("Low");
    expect(pinOut).toBeVisible();
  });

  it("toggles bits", () => {
    const pin = new Bus("pin");
    const Wrapper = () => {
      const [pins, setPins] = useState([{ pin }]);

      const toggle = () => {
        pin.toggle();
        setPins([{ pin }]);
      };

      return <Pinout pins={pins} toggle={toggle} />;
    };

    render(<Wrapper />);

    const pinOut = screen.getByText("Low");
    act(() => {
      pinOut.click();
    });
    expect(pin.busVoltage).toBe(HIGH);
    expect(screen.getByText("High")).toBeVisible();
  });

  it("increments buses", () => {
    const pin = new Bus("pin", 3);
    const Wrapper = () => {
      const [pins, setPins] = useState([{ pin }]);

      const toggle = () => {
        pin.busVoltage += 1;
        setPins([{ pin }]);
      };

      return <Pinout pins={pins} toggle={toggle} />;
    };

    render(<Wrapper />);

    const pinOut = screen.getByText("000");
    act(() => {
      pinOut.click();
    });
    expect(pin.busVoltage).toBe(1);
    expect(screen.getByText("001")).toBeVisible();
  });

  it("tracks the clock", () => {
    render(<Pinout pins={[]} clocked={true} />);

    const tick = screen.getByText("Tick");
    const tock = screen.getByText("Tock");
    const reset = screen.getByText("Reset");

    expect(screen.getByText("0")).toBeVisible();
    act(() => {
      tick.click();
    });
    expect(screen.getByText("0+")).toBeVisible();
    act(() => {
      tock.click();
    });
    expect(screen.getByText("1")).toBeVisible();
    act(() => {
      reset.click();
    });
    expect(screen.getByText("0")).toBeVisible();
  });
});