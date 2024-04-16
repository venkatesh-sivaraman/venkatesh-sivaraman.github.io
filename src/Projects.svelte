<script>
  import Card from './Card.svelte';
</script>

<h1 class="mt2">
  Venkatesh Sivaraman <span class="fw2">Projects</span>
</h1>
<p class="lh-copy measure f5">
  Here's a sampling of some of the projects and demos I've created in the past.
  Contact me if you'd like to chat about some of the work I'm doing right now!
</p>
<div class="card-container">
  <Card
    imageSrc="assets/tempo.png"
    imageAlt="Screenshot of Tempo being used to create models to predict patient readmission to a hospital."
    url="#"
  >
    <h3 class="mb0 lh-title">
      Tempo: <span class="fw3 ml1">Predictive Model Specification</span>
    </h3>
    <p class="lh-copy">
      A tool that allows data scientists and domain experts to collaboratively
      create, modify, and evaluate specifications of how a predictive model
      should work. Paper and code coming soon.
    </p>
  </Card>
  <Card
    imageSrc="assets/counterpoint_animation.gif"
    imageAlt="A GIF of Counterpoint used to animate between two scatter plot layouts containing 10,000 points."
    url="https://venkatesh-sivaraman.github.io/counterpoint/"
  >
    <h3 class="mb0 lh-title">
      Counterpoint: <span class="fw3 ml1"
        >Scalable Custom Web Visualization</span
      >
    </h3>
    <p class="lh-copy">
      Counterpoint is a TypeScript framework that helps developers create
      interactive, animated data visualizations using custom Canvas or WebGL
      rendering.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-blue"
        href="https://venkatesh-sivaraman.github.io/counterpoint/"
        target="_blank">Documentation</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/venkatesh-sivaraman/counterpoint"
        target="_blank">GitHub</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://www.npmjs.com/package/counterpoint-vis"
        target="_blank">NPM</a
      >
    </p>
  </Card>
  <Card
    imageSrc="assets/divisi.png"
    imageAlt="Screenshot of Divisi showing slices for a model trained on the UCI Adult dataset."
    url="#"
  >
    <h3 class="mb0 lh-title">
      Divisi: <span class="fw3 ml1">Interactive Slice Discovery</span>
    </h3>
    <p class="lh-copy">
      A work-in-progress Jupyter widget that uses a novel sampling-based
      algorithm to find data slices (or subgroups) that have interesting
      characteristics relative to the overall dataset.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/venkatesh-sivaraman/slice-finding"
        target="_blank">GitHub</a
      >
    </p>
  </Card>
  <Card
    imageSrc="assets/emblaze.png"
    imageAlt="Two screenshots of the Emblaze user interface."
    url="https://github.com/cmudig/emblaze"
  >
    <h3 class="mb0 lh-title">
      Emblaze: <span class="fw3 ml1"
        >Interactive Embedding Comparison Widget</span
      >
    </h3>
    <p class="lh-copy">
      Emblaze is a Jupyter notebook widget that enables creators of machine
      learning (ML) models to analyze and compare embedding spaces.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-blue"
        href="https://bit.ly/emblaze-demo"
        target="_blank">Demo</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/cmudig/emblaze"
        target="_blank">GitHub</a
      >
    </p>
  </Card>
  <Card
    imageSrc="assets/textessence.png"
    imageAlt="Screenshot of TextEssence that shows a scatter plot of COVID concepts"
    url="https://textessence.dbmi.pitt.edu"
  >
    <h3 class="mb0 lh-title">
      TextEssence: <span class="fw3 ml1"
        >Comparison of COVID Clinical Concepts</span
      >
    </h3>
    <p class="lh-copy">
      This demo (presented at NAACL 2021) allows you to study and compare
      embeddings of clinical concepts related to COVID-19. The demo currently
      supports Firefox and Chrome. Developed with Denis Newman-Griffis.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-blue"
        href="https://textessence.dbmi.pitt.edu"
        target="_blank">Demo</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/drgriffis/text-essence"
        target="_blank">GitHub</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://aclanthology.org/2021.naacl-demos.13/"
        target="_blank">Paper</a
      >
    </p>
  </Card>
  <Card
    imageSrc="assets/fireroad.png"
    imageAlt="Two smartphones showing screenshots of FireRoad"
    url="https://fireroad.mit.edu"
  >
    <h3 class="mb0 lh-title">
      FireRoad: <span class="fw3 ml1">MIT Course Planner</span>
    </h3>
    <p class="lh-copy">
      FireRoad is a web, iOS, and Android application that helps MIT students
      plan what courses they want to fulfill their undergraduate requirements.
      It offers an easy-to-use API on which students can build new applications.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-blue"
        href="https://fireroad.mit.edu"
        target="_blank">Website</a
      >
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/venkatesh-sivaraman/fireroad-server"
        target="_blank">GitHub</a
      >
    </p>
  </Card>
  <Card
    imageSrc="assets/shapesynth.png"
    imageAlt="Two screenshots of ShapeSynth showing colored shapes in each corner"
    url="https://github.com/mdhuggins/shapesynth"
  >
    <h3 class="mb0 lh-title">
      ShapeSynth: <span class="fw3 ml1">Multimodal Music Generation</span>
    </h3>
    <p class="lh-copy">
      This course project from MIT's Interactive Music Systems class (taught by
      Eran Egozy) allows users to create and visualize synthesized music using
      the keyboard, a MIDI instrument, or a Kinect. Created with Matthew
      Huggins.
    </p>
    <p>
      <a
        class="f6 link dim ph3 pv2 dib white bg-black"
        href="https://github.com/mdhuggins/shapesynth"
        target="_blank">GitHub</a
      >
    </p>
  </Card>
</div>

<style>
  .card-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: 1fr;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
  }

  @media only screen and (min-width: 800px) {
    .card-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
