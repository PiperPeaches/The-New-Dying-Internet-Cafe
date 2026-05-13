<script lang="ts">
    // import Links from './componants/links.svelte';
    // import Buttons from './componants/buttons.svelte';
	// import Configs from './componants/GitWidget.svelte';
    import Right from './componants/Main/right.svelte';
    import Left from './componants/Main/left.svelte';
    import Banner from './componants/Main/Banner.svelte';
</script>

<svelte:head>
    <title>The Dying Internet Cafe</title>
</svelte:head>

<div class="p-5 md:p-15 flex flex-col w-full gap-5 min-h-screen justify-center items-center ">
    <Banner />
    <div class="flex flex-col-reverse md:flex-row gap-5 md:w-2/3 w-full">
        <Left />
        <Right />
    </div>
</div>