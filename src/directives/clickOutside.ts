import type { Directive } from "vue";

const clickOutside: Directive<HTMLElement> = {
  beforeMount: (element, binding) => {
    element.clickOutsideEvent = (event: MouseEvent) => {
      const elementIsTarget = event.target === element;
      const targetIsNode = event.target instanceof Node;
      const elementContainsTarget = element.contains(event.target as Node);

      if (!(elementIsTarget || (targetIsNode && elementContainsTarget))) {
        if (typeof binding.value === "function") {
          binding.value(event);
        } else {
          console.error(`v-click-outside: binding is not a function.`);
        }
      }
    };

    document.body.addEventListener("click", element.clickOutsideEvent);
  },
  unmounted: (element) => {
    if (element.clickOutsideEvent) {
      document.body.removeEventListener("click", element.clickOutsideEvent);
      delete element.clickOutsideEvent;
    }
  },
};

declare global {
  interface HTMLElement {
    clickOutsideEvent?: (event: MouseEvent) => void;
  }
}

export default clickOutside;
