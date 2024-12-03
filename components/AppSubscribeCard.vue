<template>
  <div class="space-y-4 px-3 py-5">
    <div class="space-y-1">
      <h3 class="font-medium text-md">¡Hackgento es Opensource!</h3>
      <p class="text-sm">Eu! Hackgento está construido con mucho amor, pero con poco tiempo. Si te animás a ordenar un poco del quilombo que armé, abrí un Issue o PR sin miedo.</p>
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