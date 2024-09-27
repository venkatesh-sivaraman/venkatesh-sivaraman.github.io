<script>
  import { cubicInOut } from 'svelte/easing';
  import About from './About.svelte';
  import Experience from './Experience.svelte';
  import Projects from './Projects.svelte';
  import Publications from './Publications.svelte';
  import Music from './Music.svelte';
  import statefulSwap from './swap';
  import Fa from 'svelte-fa';
  import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
  import {
    faGithub,
    faGoogleScholar,
  } from '@fortawesome/free-brands-svg-icons';

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
    <div class="nav-container">
      <img
        class="profile-pic dim pointer"
        src="assets/profile.png"
        alt="Picture of Venkat in Cambridge, Massachusetts"
        on:click={() => (newTab = 0)}
      />
      <ul class="list nav-list pl0">
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
        <li>
          <a
            on:click={() => (newTab = 4)}
            class:active-link={$visibleTab == 4}
            class:link={$visibleTab != 4}>Music</a
          >
        </li>
        <li class="mt1">
          <a
            class="link contact-link flex items-center"
            href="https://github.com/venkatesh-sivaraman"
            target="_blank"
          >
            <Fa icon={faGithub} /> &nbsp;&nbsp; GitHub</a
          >
        </li>
        <li class="mt1">
          <a
            class="link contact-link flex items-center"
            href="https://scholar.google.com/citations?user=KDcGcfAAAAAJ"
            target="_blank"
          >
            <Fa icon={faGoogleScholar} /> &nbsp;&nbsp; Google Scholar</a
          >
        </li>
        <li>
          <a
            class="link contact-link flex items-center"
            href="mailto:venkats@cmu.edu"
            target="_blank"
          >
            <Fa icon={faEnvelope} /> &nbsp;&nbsp; Contact</a
          >
        </li>
      </ul>
    </div>
  </aside>
  {#if $visibleTab == 0}
    <div
      class="document"
      in:fadeAndSlide={{ above: 0 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 0 }}
      on:outroend={visibleTab.onOutro}
    >
      <About on:projects={() => (newTab = 1)} />
      <footer class="gray">Copyright 2024 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 1}
    <div
      class="document"
      in:fadeAndSlide={{ above: 1 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 1 }}
      on:outroend={visibleTab.onOutro}
    >
      <Projects />
      <footer class="gray">Copyright 2024 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 2}
    <div
      class="document"
      in:fadeAndSlide={{ above: 2 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 2 }}
      on:outroend={visibleTab.onOutro}
    >
      <Publications />
      <footer class="gray">Copyright 2024 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 3}
    <div
      class="document"
      in:fadeAndSlide={{ above: 3 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 3 }}
      on:outroend={visibleTab.onOutro}
    >
      <Experience />
      <footer class="gray">Copyright 2024 Venkatesh Sivaraman.</footer>
    </div>
  {:else if $visibleTab == 4}
    <div
      class="document"
      in:fadeAndSlide={{ above: 4 < oldTab }}
      out:fadeAndSlide={{ above: newTab > 4 }}
      on:outroend={visibleTab.onOutro}
    >
      <Music />
      <footer class="gray">Copyright 2024 Venkatesh Sivaraman.</footer>
    </div>
  {/if}
</main>

<style lang="scss">
  main {
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
      position: fixed;
    }

    main {
      display: flex;
    }

    .document {
      margin-left: 232px !important;
    }
  }

  @media (max-width: 600px) {
    aside {
      width: 100%;
    }

    main {
      flex-wrap: wrap;
    }

    .document {
      margin-top: 64px !important;
    }

    .profile-pic {
      width: 140px;
      height: 140px;
      margin-right: 32px;
    }

    .nav-container {
      display: flex;
      align-items: center;
    }

    .nav-list {
      flex-grow: 1;
    }
  }

  .profile-pic {
    width: 100px;
    height: 100px;
  }

  .document {
    flex-grow: 1;
    margin: 0 32px 32px 32px;
  }

  footer {
    padding-bottom: 32px;
  }

  ul.list li {
    padding-bottom: 16px;
  }

  .link {
    color: #777777;
  }

  .contact-link {
    color: black !important;
  }

  .link:hover {
    color: #bbbbbb;
  }

  .active-link {
    color: #357edd;
  }

  .active-link:hover {
    color: #357edd;
  }
</style>
