<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Balatro from './componants/Shaders/Balatro.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Balatro />

{@render children()}