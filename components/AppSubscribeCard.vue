<template>
  <div class="space-y-4 px-3 py-5">
    <div class="space-y-3">
      <h3 class="font-medium text-md">¡Hackgento es Opensource!</h3>
      <p class="text-sm italic">Estoy simplificando las dependencias y escribiendo la documentación para que comenzar a colaborar no sea complejo. De todos modos, si tenés ganas de contribuir todas tus Issues o PRs son bien recibidas.</p>
      <p class="text-zinc-400">— Feco </p>
    </div>
    <div class="flex justify-start">
      <UButton
        color="sky"
        size="xs"
        label="Ver el repositorio"
        to="https://github.com/fecocode/Hackgento"
        target="_blank"
      >
        <template #leading>
          <IconGithubBox />
        </template>
      </UButton>
    </div>
  </div>
</template>