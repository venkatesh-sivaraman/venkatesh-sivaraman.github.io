<script>
  import Card from './Card.svelte';
</script>

<h1 class="mt2">
  Venkatesh Sivaraman <span class="fw2">Music</span>
</h1>
<p class="lh-copy measure f5">
  I have been studying piano since the age of three, and have performed solo,
  chamber, and orchestral works with a variety of groups. See some of my recent
  performances below!
</p>
<div class="card-container">
  <Card
    url="https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C"
    videoSrc="https://www.youtube.com/embed/PygP6bV5BTM?si=2H7gFow7GGPEMc30"
  >
    <h3 class="mb0 lh-title">
      Ravel: <span class="fw3 ml1">Miroirs</span>
    </h3>
    <p class="gray mv0">October 2025</p>
    <p class="lh-copy">
      Venkat's last solo recital at CMU, in collaboration with Prof. Sergey
      Schepkin, features Ravel's <em>Miroirs</em>.
      <a
        class="link blue"
        href="https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C"
        target="_blank">Click to view the playlist.</a
      >
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=1mqnrWxZ-xw"
    videoSrc="https://www.youtube.com/embed/1mqnrWxZ-xw"
  >
    <h3 class="mb0 lh-title">
      Debussy: <span class="fw3 ml1">Estampes</span>
    </h3>
    <p class="gray mv0">February 2022</p>
    <p class="lh-copy">
      Venkat performs Debussy's <em>Estampes</em> at his second solo recital at CMU.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=Fm-r7pBj0Us"
    videoSrc="https://www.youtube.com/embed/Fm-r7pBj0Us"
  >
    <h3 class="mb0 lh-title">
      Liszt: <span class="fw3 ml1">Mephisto Waltz No. 1</span>
    </h3>
    <p class="gray mv0">February 2022</p>
    <p class="lh-copy">
      Venkat performs Liszt's <em>Mephisto Waltz No. 1</em> at his second solo recital
      at CMU.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=AjKWi564EIY"
    videoSrc="https://www.youtube.com/embed/AjKWi564EIY"
  >
    <h3 class="mb0 lh-title">
      Solo Recital <span class="fw3 ml1">Fall 2020</span>
    </h3>
    <p class="gray mv0">November 2020</p>
    <p class="lh-copy">
      Venkat performs sonatas by Scriabin, Beethoven, and Rachmaninoff in this
      virtual solo recital streamed from Carnegie Mellon's Kresge Recital Hall.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=Ulj9CzxSgwU"
    videoSrc="https://www.youtube.com/embed/Ulj9CzxSgwU"
  >
    <h3 class="mb0 lh-title">
      Shulamit Ran: <span class="fw3 ml1">Soliloquy</span>
    </h3>
    <p class="gray mv0">May 2019</p>
    <p class="lh-copy">
      Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Soliloquy by
      Shulamit Ran at an MIT Chamber Music Society concert.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=sldyqayzrKw"
    videoSrc="https://www.youtube.com/embed/sldyqayzrKw"
  >
    <h3 class="mb0 lh-title">
      Sivaraman: <span class="fw3 ml1">Picasso's Dreams</span>
    </h3>
    <p class="gray mv0">April 2019</p>
    <p class="lh-copy">
      Venkat performs his composition Picasso's Dreams at a solo recital at
      MIT's Killian Hall.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=PyQaq62N_fI"
    videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"
  >
    <h3 class="mb0 lh-title">
      Shostakovich: <span class="fw3 ml1">Piano Trio No. 2</span>
    </h3>
    <p class="gray mv0">May 2018</p>
    <p class="lh-copy">
      Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Shostakovich's
      second piano trio at an MIT Chamber Music Society concert in Killian Hall.
      See also the
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=RUwITozfR74"
        target="_blank">second</a
      >
      and
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=0dqsxVFovXo"
        target="_blank">third/fourth</a
      > movements.
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=PyQaq62N_fI"
    videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"
  >
    <h3 class="mb0 lh-title">
      Ravel: <span class="fw3 ml1">Gaspard de la Nuit</span>
    </h3>
    <p class="gray mv0">March 2018</p>
    <p class="lh-copy">
      Venkat performs the legendarily difficult <em>Gaspard de la Nuit</em>
      suite by Ravel at a solo recital in MIT's Killian Hall. See also the
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=-iSp0s9zpUE"
        target="_blank">second</a
      >
      and
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=cULwYsX6Q88"
        target="_blank">third</a
      > movements.
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
