<template>
  <div class="space-y-4 px-3 py-5">
    <div class="space-y-3">
      <h3 class="font-medium text-md">¡Taberna es Opensource!</h3>
      <p class="text-sm italic">No soy un experto en proyectos opensource, por lo que aún la experiencia de contribución no es la mejor. Si te animás, acepto ayuda para mejorarla. Todas tus Issues y PRs son bienvenidas.</p>
      <p class="text-zinc-400">— Feco </p>
    </div>
    <div class="flex justify-start">
      <UButton
        color="yellow"
        size="xs"
        label="Ver el repositorio"
        to="https://github.com/fecocode/Taberna"
        target="_blank"
      >
        <template #leading>
          <IconGithubBox />
        </template>
      </UButton>
    </div>
  </div>
</template>