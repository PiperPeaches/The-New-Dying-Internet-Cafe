<script lang="ts">
    import Links from '../links.svelte';
    import Buttons from '../buttons.svelte';
    import Button from '../button.svelte';
    import ServerStats from '../ServerStats.svelte';
    // import Configs from '../GitWidget.svelte';  
</script>

    
<div class=" w-full md:w-1/3 h-full flex flex-col gap-5">
    <Buttons />
    <Button />
    
    <ServerStats />

    <Links />
</div>