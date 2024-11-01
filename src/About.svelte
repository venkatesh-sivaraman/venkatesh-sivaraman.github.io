<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<h1 class="mt2">Venkatesh Sivaraman</h1>
<p class="lh-copy f3 measure-wide">
  Hi! 👋🏾 I'm Venkat, a PhD student at the Carnegie Mellon University <a
    class="link blue dim"
    href="https://hcii.cmu.edu"
    target="_blank">Human-Computer Interaction Institute</a
  >. Advised by
  <a class="link blue dim" href="https://perer.org" target="_blank"
    >Adam Perer</a
  >, I study
  <span class="fw6"
    >how people use artificial intelligence (AI) to guide their decision-making</span
  >, and use that knowledge to
  <span class="fw6">build better ways to communicate AI predictions</span>. I'm
  particularly interested in high-stakes decision making domains such as
  <span class="fw6">health care</span>, where an understanding of algorithms'
  strengths and limitations is crucial to helping improve people's lives.
</p>
<p class="lh-copy f4 measure-wide">
  I have recently been focused on tools for model developers and clinicians, as
  well as tools to help build beautiful data visualizations (<a
    class="link blue"
    href="#"
    on:click={() => dispatch('projects')}>see more projects</a
  >):
</p>
<div class="project-preview-row">
  <a class="link black mr2" href="#">
    <div
      class="project-preview flex flex-column bg-animate hover-bg-near-white pa2"
    >
      <img
        src="assets/tempo.png"
        alt="Screenshot of Tempo being used to create models to predict patient readmission to a hospital."
      />
      <p class="f5">
        <span class="b">Tempo:</span>
        <span class="fw3">Predictive Model Specification</span>
      </p>
    </div>
  </a>
  <a
    class="link black mr2"
    href="https://dig.cmu.edu/counterpoint/"
    target="_blank"
  >
    <div
      class="project-preview flex flex-column bg-animate hover-bg-near-white pa2"
    >
      <img
        src="assets/counterpoint_animation.gif"
        class="counterpoint-gif"
        alt="A GIF of Counterpoint used to animate between two scatter plot layouts containing 10,000 points."
      />
      <p class="f5">
        <span class="b">Counterpoint:</span>
        <span class="fw3">Scalable Custom Web Visualization</span>
      </p>
    </div>
  </a>
</div>

<p class="lh-copy f4 measure-wide">
  For more information, please see my <a
    class="link blue"
    href="/assets/venkats_cv.pdf">CV</a
  >.
</p>
<p class="lh-copy f4 measure-wide">
  I would love to chat about research and collaboration opportunities! Contact
  me at venkats [at] cmu [dot] edu.
</p>

<style>
  .project-preview-row {
    overflow-x: scroll;
    white-space: nowrap;
  }
  .project-preview-row a {
    display: inline-block;
  }
  .project-preview {
    border-radius: 4px;
    max-width: 360px;
    white-space: normal;
  }
  .project-preview img {
    object-fit: contain;
    height: 160px;
  }

  .counterpoint-gif {
    background-image: url('assets/counterpoint_animation_static.png');
  }
</style>
