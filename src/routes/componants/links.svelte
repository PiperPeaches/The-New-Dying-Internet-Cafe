<script lang="ts">
  import { goto } from '$app/navigation';

  interface LinkEntry {
    text: string;
    offsite: boolean;
    href: string;
  }

  let links: LinkEntry[] = [
    { text: 'Join my Discord!', offsite: true, href: 'https://discord.gg/TxW6dmdz7m'},
    { text: 'Join the Indieweb Hangout Discord', offsite: true, href: 'https://discord.gg/2gS3wY3g' },
    { text: 'YouTube', offsite: true, href: 'https://www.youtube.com/@dying-internet' },
    { text: 'GitHub', offsite: true, href: 'https://github.com/piperpeaches'}
  ];
</script>

<div class="flex flex-col w-full rounded border-white border p-5">
  <h2 class="flex justify-center">Links</h2>
  <div class="flex flex-col text-lg">
    {#each links as link, i (i)}
      {#if link.offsite}
        <a
          href={link.href}
          target="_blank"
          aria-label="Visit {link.text} (opens in a new tab)"
          class="hover:text-purple-300 hover:underline transition-colors duration-100"
        >
          + {link.text}
        </a>
      {:else}
        <a
          href={link.href}
          aria-label="Go to {link.text} page"
          class="hover:text-purple-300 hover:underline transition-colors duration-100"
        >
          + {link.text}
        </a>
      {/if}
    {/each}
  </div>
</div>