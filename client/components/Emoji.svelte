<i class="emoji"><slot /></i>

<style>
  .emoji {
    --x: 0.75;
    --bw: calc(var(--x) * var(--border-width));
    --bw-neg: calc(-1 * var(--x) * var(--border-width));

    /* 🔥 FULL COVERAGE OVERKILL! 🔥 */
    text-shadow: 0 0 0 var(--border-color), 0 0 var(--bw) var(--border-color),
      0 0 var(--bw-neg) var(--border-color),
      0 var(--bw) var(--bw) var(--border-color),
      0 var(--bw) var(--bw-neg) var(--border-color),
      0 var(--bw-neg) var(--bw) var(--border-color),
      0 var(--bw-neg) var(--bw-neg) var(--border-color),
      var(--bw) var(--bw) var(--bw) var(--border-color),
      var(--bw) var(--bw) var(--bw-neg) var(--border-color),
      var(--bw) var(--bw-neg) var(--bw-neg) var(--border-color),
      var(--bw-neg) var(--bw-neg) var(--bw-neg) var(--border-color),
      var(--bw-neg) var(--bw-neg) var(--bw) var(--border-color),
      var(--bw-neg) var(--bw) var(--bw) var(--border-color);
  }
</style>
