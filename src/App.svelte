<script>
  import { cubicInOut } from 'svelte/easing';
  import About from './About.svelte';
  import Experience from './Experience.svelte';
  import Projects from './Projects.svelte';
  import Publications from './Publications.svelte';
  import statefulSwap from './swap';

  export let name;

  const visibleTab = statefulSwap(0);
  let oldTab = 0;
  let newTab = 0;
  $: if ($visibleTab != newTab && $visibleTab != null) {
    console.log($visibleTab, newTab);
    oldTab = $visibleTab;
    $visibleTab = newTab;
  }

  const AnimationDuration = 500;

  function fadeAndSlide(
    node,
    { duration = AnimationDuration, above = 1, amount = 100 }
  ) {
    return {
      duration,
      css: (t) => {
        const eased = cubicInOut(t);

        return `
					transform: translateY(${(amount - eased * amount) * (above ? -1 : 1)}px);
					opacity: ${eased};`;
      },
    };
  }
</script>

<main class="sans-serif">
  <aside>
    <ul class="list pl0">
      <li>
        <a
          on:click={() => (newTab = 0)}
          class:active-link={$visibleTab == 0}
          class:link={$visibleTab != 0}>About</a
        >
      </li>
      <li>
        <a
          on:click={() => (newTab = 1)}
          class:active-link={$visibleTab == 1}
          class:link={$visibleTab != 1}>Projects</a
        >
      </li>
      <li>
        <a
          on:click={() => (newTab = 2)}
          class:active-link={$visibleTab == 2}
          class:link={$visibleTab != 2}>Publications</a
        >
      </li>
      <li>
        <a
          on:click={() => (newTab = 3)}
          class:active-link={$visibleTab == 3}
          class:link={$visibleTab != 3}>Experience</a
        >
      </li>
    </ul>
  </aside>
  {#if $visibleTab == 0}
    <div
      class="document"
      in:fadeAndSlide={{ above: 0 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 0 }}
      on:outroend={visibleTab.onOutro}
    >
      <About />
      <footer class="gray">Copyright 2022 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 1}
    <div
      class="document"
      in:fadeAndSlide={{ above: 1 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 1 }}
      on:outroend={visibleTab.onOutro}
    >
      <Projects />
      <footer class="gray">Copyright 2022 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 2}
    <div
      class="document"
      in:fadeAndSlide={{ above: 2 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 2 }}
      on:outroend={visibleTab.onOutro}
    >
      <Publications />
      <footer class="gray">Copyright 2022 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 3}
    <div
      class="document"
      in:fadeAndSlide={{ above: 3 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 3 }}
      on:outroend={visibleTab.onOutro}
    >
      <Experience />
      <footer class="gray">Copyright 2022 Venkatesh Sivaraman.</footer>
    </div>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 64px;
  }

  aside {
    margin: 0 64px 0 64px;
    flex: 0 0 auto;
  }

  @media (min-width: 600px) {
    aside {
      width: 200px;
    }
  }

  @media (max-width: 600px) {
    aside {
      width: 100%;
    }

    main {
      flex-wrap: wrap;
    }
  }

  .document {
    flex-grow: 1;
    margin: 0 32px 32px 32px;
  }

  ul.list li {
    padding-bottom: 16px;
  }

  .link {
    color: #777777;
  }

  .active-link {
    color: #357edd;
  }
</style>
