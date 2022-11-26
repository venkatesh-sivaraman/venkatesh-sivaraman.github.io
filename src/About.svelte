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
  <span class="fw6">child welfare</span>
  and <span class="fw6">health care</span>, where an understanding of
  algorithms' strengths and limitations is crucial to helping improve people's
  lives.
</p>
<p class="lh-copy f4 measure-wide">
  I have recently been focused on tools for model developers and intensive care
  clinicians (<a
    class="link blue"
    href="#"
    on:click={() => dispatch('projects')}>see more projects</a
  >):
</p>
<div class="project-preview-row">
  <a
    class="link black mr2"
    href="https://github.com/cmudig/ai-clinician-explorer"
    target="_blank"
  >
    <div
      class="project-preview flex flex-column bg-animate hover-bg-near-white pa2"
    >
      <img
        src="assets/ai-clinician.gif"
        alt="Screenshot of AI Clinician Explorer showing charts of patient vitals and labs that dynamically update as the user drags a slider to navigate through the patient's trajectory."
      />
      <p class="f5">
        <span class="b">AI Clinician Explorer:</span>
        <span class="fw3">Patient Trajectory Visualization</span>
      </p>
    </div>
  </a>
  <a class="link black mr2" href="https://bit.ly/emblaze-demo" target="_blank">
    <div
      class="project-preview flex flex-column bg-animate hover-bg-near-white pa2"
    >
      <img src="assets/emblaze.png" alt="A screenshot of Emblaze." />
      <p class="f5">
        <span class="b">Emblaze:</span>
        <span class="fw3">Interactive Embedding Comparison</span>
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
</style>
