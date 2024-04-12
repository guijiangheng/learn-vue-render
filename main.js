import { effect, ref } from "@vue/reactivity";

const render = (domString, container) => {
  container.innerHTML = domString;
};

const container = document.querySelector("#app");
const count = ref(0);

effect(() => {
  render(
    `
    <div>
      <div>count is ${count.value}</div>
      <button id="button">+1</button>
    </div>
  `,
    container
  );

  document.querySelector("#button").addEventListener("click", () => {
    count.value += 1;
  });
});
