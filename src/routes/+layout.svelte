<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<title>Word Salad Helper</title>
	<meta name="description" content="A helper tool for the Word Salad game by Bleppo Games." />
</svelte:head>
{@render children()}
