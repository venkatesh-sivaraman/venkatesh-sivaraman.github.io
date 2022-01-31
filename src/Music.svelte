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
<div class="cf shift-left equal-height">
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
    url="https://mta.mit.edu/video/mitso-fall-concert-live-webcast"
    imageSrc="assets/mitso.png"
    imageAlt="A picture of Venkat at the piano from a poster for his performance with the MIT Symphony"
  >
    <h3 class="mb0 lh-title">
      Ravel: <span class="fw3 ml1">Piano Concerto in G</span>
    </h3>
    <p class="gray mv0">October 2021</p>
    <p class="lh-copy">
      Venkat performs Ravel's Piano Concerto as a soloist with the MIT Symphony
      as co-winner of the MIT Concerto Competition from 2020. Click to watch the
      live-stream (performance starts at 20').
    </p>
  </Card>
  <Card
    url="https://www.youtube.com/watch?v=Yo6NBDNKYiM"
    videoSrc="https://www.youtube.com/embed/Yo6NBDNKYiM"
  >
    <h3 class="mb0 lh-title">
      Dvorak: <span class="fw3 ml1">Piano Trio No. 3</span>
    </h3>
    <p class="gray mv0">December 2019</p>
    <p class="lh-copy">
      Ji Seok Kim, Taylor Safrit, and Venkatesh Sivaraman perform Dvorak's Piano
      Trio No. 3 at MIT's Killian Hall in a Chamber Music Society concert.
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
  <Card
    url="https://www.youtube.com/watch?v=sb6SReBcXUI"
    videoSrc="https://www.youtube.com/embed/sb6SReBcXUI"
  >
    <h3 class="mb0 lh-title">
      Ravel: <span class="fw3 ml1">Piano Trio in A minor</span>
    </h3>
    <p class="gray mv0">December 2017</p>
    <p class="lh-copy">
      Venkat performs Ravel's Piano Trio with Henry Love and Taylor Safrit. See
      also the
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=7Ku-EH3iPQc"
        target="_blank">first</a
      >,
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=KfOMI2H7vMk"
        target="_blank">third</a
      >, and
      <a
        class="link blue"
        href="https://www.youtube.com/watch?v=FllN04uTW4k"
        target="_blank">fourth</a
      > movements.
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
