import { type Directive } from "vue";

enum Positions {
  Left = "left",
  Right = "right",
  Bottom = "bottom",
  Top = "top",
}

const isPosition = (arg: any) => Object.values(Positions).includes(arg);

const tooltip: Directive<HTMLElement, string, never, Positions> = {
  mounted: (element, binding) => {
    const tooltip = document.createElement("div");
    tooltip.textContent = binding.value;
    tooltip.classList.add("tooltip");
    tooltip.role = "tooltip";

    const argIsPosition = isPosition(binding.arg);
    const position =
      argIsPosition && binding.arg !== undefined
        ? binding.arg
        : Positions.Bottom;

    tooltip.classList.add(`tooltip-${position}`);
    document.body.appendChild(tooltip);

    const updateTooltipPosition = () => {
      const { top, left } = calculateCoords(element, position);
      tooltip.style.top = top;
      tooltip.style.left = left;
    };

    const resizeObserver = new ResizeObserver(() => {
      updateTooltipPosition();
    });

    resizeObserver.observe(document.body);

    element.tooltipHandlers = {
      resizeObserver,
      mouseEnterHandler: () => {
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "visible";
        tooltip.ariaHidden = "false";
      },
      mouseLeaveHandler: () => {
        tooltip.style.opacity = "0";
        tooltip.style.visibility = "hidden";
        tooltip.ariaHidden = "true";
      },
    };

    element.addEventListener(
      "mouseenter",
      element.tooltipHandlers.mouseEnterHandler,
    );
    element.addEventListener(
      "mouseleave",
      element.tooltipHandlers.mouseLeaveHandler,
    );
  },

  unmounted: (el) => {
    if (el.tooltipHandlers) {
      el.removeEventListener(
        "mouseenter",
        el.tooltipHandlers.mouseEnterHandler,
      );

      el.removeEventListener(
        "mouseleave",
        el.tooltipHandlers.mouseLeaveHandler,
      );

      el.tooltipHandlers.resizeObserver.disconnect();

      delete el.tooltipHandlers;
    }
  },
};

function calculateCoords(element: HTMLElement, position: Positions) {
  let top = 0;
  let left = 0;

  const rect = element.getBoundingClientRect();

  switch (position) {
    case Positions.Top: {
      top = rect.top - 8;
      left = rect.left + rect.width / 2;
      break;
    }
    case Positions.Bottom: {
      top = rect.top + rect.height + 8;
      left = rect.left + rect.width / 2;
      break;
    }
    case Positions.Left: {
      top = rect.top + rect.height / 2;
      left = rect.left - 8;
      break;
    }
    case Positions.Right: {
      top = rect.top + rect.height / 2;
      left = rect.left + rect.width + 8;
      break;
    }
    default: {
      top = rect.top + rect.height + 8;
      left = rect.left + rect.width / 2;
      break;
    }
  }

  return { top: `${top}px`, left: `${left}px` };
}

declare global {
  interface HTMLElement {
    tooltipHandlers?: {
      resizeObserver: ResizeObserver;
      mouseEnterHandler: (event: MouseEvent) => void;
      mouseLeaveHandler: (event: MouseEvent) => void;
    };
  }
}

export default tooltip;
