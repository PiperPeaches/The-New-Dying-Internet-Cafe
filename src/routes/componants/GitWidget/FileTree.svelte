<script lang="ts">
    import { onMount } from 'svelte';

    let { path = "", username = "piperpeaches", repo = "Nixos-Config" } = $props();
    
    let items = $state([]);
    let loading = $state(true);
    let error = $state(null);

    async function loadDirectory() {
        try {
            const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            
            // Sort so folders appear above files
            items = data.sort((a, b) => (a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1));
            loading = false;
        } catch (e) {
            error = e.message;
            loading = false;
        }
    }

    onMount(loadDirectory);
</script>

{#if loading}
    <div class="loader">...</div>
{:else if error}
    <div class="err">!! {error}</div>
{:else}
    <ul class="tree-list">
        {#each items as item}
            <li class="item">
                {#if item.type === 'dir'}
                    <span class="folder-icon">📁</span>
                    <span class="name folder">{item.name}/</span>
                    <!-- Recursively load subfolders -->
                    <div class="sub-tree">
                        <svelte:self path={item.path} {username} {repo} />
                    </div>
                {:else}
                    <span class="file-icon">📄</span>
                    <a href={item.html_url} target="_blank" class="name file">{item.name}</a>
                {/if}
            </li>
        {/each}
    </ul>
{/if}
