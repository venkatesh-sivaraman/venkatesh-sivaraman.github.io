<script>
  export let imageSrc = null;
  export let imageAlt = '';
  export let url = '';
</script>

<div class="fl w-50-ns w-100-m w-100 pa2">
  <a href={url} target="_blank" class="link black">
    <div class="card pa2 bg-animate hover-bg-near-white pointer">
      {#if !!imageSrc}
        <div class="img-container">
          <img
            src={imageSrc}
            class="db w-100 card-img br2 br--top"
            alt={imageAlt}
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
    border: 1px solid #bbbbbb;
    border-radius: 4px;
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
</style>
