<script lang="ts">
    // import Links from '../links.svelte';
    // import Buttons from '../buttons.svelte';
    import Configs from '../GitWidget/GitWidget.svelte';  
</script>

<div class=" flex flex-col gap-5 text-white w-full">
    <h1 class="flex justify-center text-5xl">The Dying Internet Cafe</h1>
    <div class="flex 2xl:flex-row justify-center gap-5">
        <img src="/assets/cheesecakepfp.webp" alt="Cheesecake" class="w-50 h-50 rounded xl:block hidden ">
        <p>
            My name is <strong>Cheesecake</strong>, and creating things for everyones entertainment is my passion.
            I enjoy researching and fiddling with code and technology.
            I&apos;m a <span class='text-pink-300'> girl</span> from the east coast of the United States.
            A few things I love to do besides tech and entertainment are graphic design, drawing, and photography.
            I&apos;m into <span Class='text-red-400'>Hazbin Hotel</span>, <span Class='text-yellow-400'>The Amazing Digital Circus</span>, as well as <span Class='text-purple-300'>Murder Drones</span>.
            One of my goals in the future is to create a team that can help me make movies, shows, games, and physical products.
            I&apos;m also a voice actor and that&apos;s another reason I exist here.
            I love to create things and I can&apos;t wait to be your host!
        </p>
    </div>

    <Configs/>
</div>