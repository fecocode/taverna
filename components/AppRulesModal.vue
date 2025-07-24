<template>
  <UCard>
    <template #header>
      <div class="flex justify-end">
        <UButton
          size="sm"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="soft"
          icon="i-heroicons-x-mark-solid"
          class="close-button"
          @click="$emit('close')"
        />
      </div>
    </template>
    <h2 class="text-2xl font-semibold mb-4">Código de conducta de Taberna</h2>
    <p class="text-base font-semibold mb-2">1. Respeto y Consideración</p>
    <p class="mb-4">
      <span class="font-semibold">Trata a Todos con Respeto:</span> Es fundamental tratar a los demás con respeto. Queda prohibido el uso de lenguaje ofensivo, difamatorio o discriminatorio. Queremos que esta sea una comunidad segura para todos.<br>
      <span class="font-semibold">Protegé la Privacidad:</span> No se permite la publicación de información personal de terceros sin su consentimiento explícito. Esto incluye nombres completos, direcciones, números de teléfono y cualquier otro dato que pueda identificar a una persona.
    </p>

    <p class="text-base font-semibold mb-2">2. Publicación de Contenido</p>
    <p class="mb-4">
      <span class="font-semibold">Contenido Prohibido:</span> No se permitirá contenido que promueva la violencia, el odio, la discriminación o cualquier actividad ilegal. Mantengamos este espacio divertido y seguro para todos.<br>
      <span class="font-semibold">Protección de Menores:</span> Está prohibido publicar cualquier contenido que incluya a menores de edad sin el consentimiento de sus padres o tutores legales.
    </p>

    <p class="text-base font-semibold mb-2">3. Cumplimiento de las Leyes</p>
    <p class="mb-4">
      <span class="font-semibold">Respeto a las Leyes Locales:</span> Es necesario cumplir con todas las leyes y regulaciones aplicables en tu país. Esto incluye las leyes sobre privacidad, difamación y cualquier otra normativa relevante.<br>
      <span class="font-semibold">Derechos de Autor:</span> No se permite la publicación de contenido que infrinja los derechos de autor o de propiedad intelectual de otras personas.
    </p>

    <p class="text-base font-semibold mb-2">4. Mantenimiento del Orden</p>
    <p class="mb-4">
      <span class="font-semibold">Moderación:</span> Nuestro equipo tiene el derecho de moderar y eliminar cualquier contenido que no cumpla con este código de conducta. Queremos mantener este espacio seguro y divertido.<br>
      <span class="font-semibold">Reportes de Abuso:</span> Si ves algo inapropiado, por favor, reportalo utilizando nuestras herramientas de reporte. Tu colaboración es esencial para mantener la comunidad segura.
    </p>

    <p class="text-base font-semibold mb-2">5. Consecuencias por Incumplimiento</p>
    <p class="mb-4">
      <span class="font-semibold">Sanciones:</span> El incumplimiento de este código de conducta puede resultar en advertencias, suspensión temporal o eliminación permanente de la cuenta.<br>
      <span class="font-semibold">Proceso de Apelación:</span> Si considerás que una sanción fue injusta, podés apelar siguiendo el proceso que hemos establecido.
    </p>

    <p class="text-base font-semibold mb-2">6. Actualizaciones y Revisión</p>
    <p class="mb-4">
      <span class="font-semibold">Revisión y Actualización del Código de Conducta:</span> Este código de conducta será revisado y actualizado periódicamente. Te informaremos sobre cualquier cambio significativo.
    </p>

  </UCard>
</template>

<script lang="ts" setup>
defineEmits(['close'])
</script>

<style>

</style>