<script lang="ts">
    import buttonGif from '$lib/assets/button.gif';
    let { copyText = "Add my button to your site, it helps a ton!" } = $props();

    function handleClick() {
        navigator.clipboard.writeText(copyText);
    }
</script>

<div class='flex flex-col p-3 w-full h-35 justify-center sm-h-90 gap-5 rounded border-1 bg-green cursor-pointer' on:click={handleClick}>
    <div class='justify-center flex items-center'>
        <img src={buttonGif} class='rounded' width={88} height={31} alt='Button' />
    </div>

    <p class='text-center text-sm'>Add my button to your site, it helps a ton!</p>
</div>