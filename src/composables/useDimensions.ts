import { onMounted, onUnmounted, reactive } from "vue";

export default function useDimensions() {
  const dimensions = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onResize = () => {
    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;
  };

  const resizeOberver = new ResizeObserver(onResize);

  onMounted(() => resizeOberver.observe(document.body));
  onUnmounted(() => resizeOberver.disconnect());

  return dimensions;
}
