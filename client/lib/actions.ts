export const pressEscape = (
  node: Node,
  onPressEscape: () => void,
): SvelteActionReturnType => {
  const handleKeydown = ({ key }: KeyboardEvent) => {
    // if (key === "Enter") updateServiceWorker(true);
    if (key === "Escape") onPressEscape();
  };

  document.addEventListener("keydown", handleKeydown);

  return {
    destroy: () => {
      document.removeEventListener("keydown", handleKeydown);
    },
  };
};
