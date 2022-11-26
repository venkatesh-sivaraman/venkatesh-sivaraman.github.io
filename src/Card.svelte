<script>
  export let imageSrc = null;
  export let imageAlt = '';
  export let url = '';
  export let videoSrc = null;
</script>

<div class="w-100 pa1">
  <a href={url} target="_blank" class="link black">
    <div class="card pa3 bg-animate hover-bg-near-white pointer">
      {#if !!imageSrc}
        <div class="img-container">
          <img
            src={imageSrc}
            class="db w-100 card-img br2 br--top"
            alt={imageAlt}
          />
        </div>
      {:else if !!videoSrc}
        <div class="video-container">
          <iframe
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            src={videoSrc}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      {/if}
      <div class="pa2 card-content">
        <slot />
      </div>
    </div>
  </a>
</div>

<style>
  .card {
    border-radius: 6px;
  }

  .img-container {
    height: 200px;
  }

  .card-img {
    height: 100%;
    object-fit: contain;
  }

  .card-content {
    flex-shrink: 0;
  }

  .video-container {
    position: relative;
    height: 200px;
    width: 100%;
  }
</style>
