<script lang="ts">
    import { onMount } from 'svelte';

    let username = "piperpeaches";
    let repo = "Nixos-Config";
    
    // Svelte 5 Runes for state
    let files = $state([]);
    let selectedFileContent = $state("");
    let currentFileName = $state("");
    let loading = $state(true);
    let viewLoading = $state(false);

    // Fetch the top-level directory
    async function fetchRepoStructure() {
        try {
            const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/`);
            files = await res.json();
            loading = false;
        } catch (e) {
            console.error("Failed to load repo", e);
        }
    }

    // Fetch the raw text of a specific file
    async function viewFile(file) {
        if (file.type === 'dir') return; // Ignore folders for now
        
        viewLoading = true;
        currentFileName = file.name;
        
        try {
            // download_url gives the raw text content
            const res = await fetch(file.download_url);
            selectedFileContent = await res.text();
        } catch (e) {
            selectedFileContent = "Error loading file content.";
        } finally {
            viewLoading = false;
        }
    }

    onMount(fetchRepoStructure);
</script>

<div class="explorer-container">
    <!-- Sidebar: The File List -->
    <div class="sidebar">
        <div class="label">FILE_BROWSER: /{repo}</div>
        {#if loading}
            <div class="loading">SCANNING...</div>
        {:else}
            <ul class="file-tree">
                {#each files as file}
                    <li class="file-item">
                        <button 
                            onclick={() => viewFile(file)} 
                            class:active={currentFileName === file.name}
                            class="file-btn"
                        >
                            <span class="icon">{file.type === 'dir' ? '📁' : '📄'}</span>
                            {file.name}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    <!-- Main Stage: The Code Viewer -->
    <div class="viewer">
        <div class="label">VIEWER: {currentFileName || "no_file_selected"}</div>
        <div class="content-area">
            {#if viewLoading}
                <div class="loading">FETCHING_RAW_DATA...</div>
            {:else if selectedFileContent}
                <pre><code>{selectedFileContent}</code></pre>
            {:else}
                <div class="placeholder">Select a file to inspect source code.</div>
            {/if}
        </div>
    </div>
</div>
