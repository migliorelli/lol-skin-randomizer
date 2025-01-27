import { reactive, watchEffect } from "vue";

export default function useDimensions() {
  const dimensions = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  watchEffect((onCleanup) => {
    const onResize = () => {
      dimensions.width = window.innerWidth;
      dimensions.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    onCleanup(() => {
      window.removeEventListener("resize", onResize);
    });
  });

  return dimensions;
}
