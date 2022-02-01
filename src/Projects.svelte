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
<div class="cf shift-left equal-height">
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
        href="https://github.com/drgriffis/textessence"
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
  .shift-left {
    margin-left: -0.5rem;
  }

  .equal-height {
    align-content: stretch;
  }
</style>
