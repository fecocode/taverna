<template>
  <UCard>
    <template #header>
      <div class="app-help-modal__header">
        <span>Detalles de uso de la app</span>
        <UButton
          size="xs"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-solid"
          @click="$emit('close')"
        >
        </UButton>
      </div>
    </template>
    <div class="app-help-modal">
      <UAlert
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="Importante"
        :ui="{ icon: { base: 'text-yellow-500' } }"
      >
        <template #description>
          Si no encontrás la ayuda que necesitás dentro de esta sección <strong>siempre</strong> podés escribirme a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a> y dentro de las 24 horas le buscamos una solución a tu situación.
        </template>
      </UAlert>

      <UAlert
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="Más importante"
        :ui="{ icon: { base: 'text-red-500' } }"
      >
        <template #description>
          Sé que no es muy divertido, pero leé el <b>Código de conducta</b>, los <b>Términos y condiciones</b> y las <b>Políticas de privacidad</b>. Podés ahorrarte problemas vos, y lo más importante, me los ahorras a mí.
        </template>
      </UAlert>

      <UAccordion 
        :items="items"
        color="indigo"
        variant="ghost"
        size="sm"
        class="mt-5"
        :ui="{ wrapper: 'flex flex-col w-full' }"
      >
        <template #item="{ item }">
          <div v-if="item.id === 0">
            <p class="text-base font-semibold mb-2">1. Respeto y Consideración</p>
            <p class="mb-4">
              <span class="font-semibold">Trata a Todos con Respeto:</span> Es fundamental tratar a los demás con respeto. Queda prohibido el uso de lenguaje ofensivo, difamatorio o discriminatorio. Queremos que esta sea una comunidad segura para todos.<br>
              <span class="font-semibold">Protegé la Privacidad:</span> No se permite la publicación de información personal de terceros sin su consentimiento explícito. Esto incluye nombres completos, direcciones, números de teléfono y cualquier otro dato que pueda identificar a una persona.
            </p>
  
            <p class="text-base font-semibold mb-2">2. Publicación de Contenido</p>
            <p class="mb-4">
              <span class="font-semibold">Chismes Reales o Ficticios:</span> Podés publicar chismes tanto reales como ficticios, pero bajo ninguna circunstancia se permite incluir nombres propios ni datos que puedan difamar a alguien.<br>
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
          </div>
          <div v-if="item.id === 1">
            <p class="text-base font-semibold mb-2">1. Completá el formulario de creación de cuenta</p>
            <p class="mb-4">
              Sólo se te pedirá: <b>nombre de usuario</b>, <b>email</b> y <b>contraseña</b>
            </p>
            <p class="text-base font-semibold mb-2">2. Revisá tu correo electrónico</p>
            <p class="mb-4">
              Te enviaremos un email con un código de 6 números para completar el registro, si no te llega podés solicitar uno nuevo.
            </p>
            <p class="text-base font-semibold mb-2">3. Ingresá el código de 6 dígitos en el formulario de creación de cuenta</p>
            <p class="mb-4">
              Listo! Ya podés utilizar la app.
            </p>
          </div>
          <div v-if="item.id === 2">
            <p class="mb-4">
              Escribime a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a> solicitando la eliminación de tus datos personales y borraré la totalidad de tus datos personales dentro de las 72hs hábiles.
            </p>
            <p class="mb-4">
              <u>Importante:</u> Me tenés que escribir desde el correo electrónico con el que te registraste a Solopreneurs.space
            </p>
          </div>
          <div v-if="item.id === 3">
            <p class="mb-4">
              Actualmente estoy trabajando en un flujo automatizado de reportes. Mientras tanto, por favor escribime a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a> y lo resolvemos.
            </p>
            <p class="mb-4">
              <u>Importante:</u> Me tenés que enviar el link del post que te resultó ofensivo o de mal gusto.
            </p>
          </div>
          <div v-if="item.id === 4">
            <p class="mb-4">
              Podés <b>crear</b>, <b>editar</b> y <b>eliminar</b> tus propios chismes.
            </p>
            <p class="mb-4">
              Además, podés <b>pochoclear (guardar)</b> chismes para mantenerlos en tu perfil y darles seguimiento.
            </p>
            <p class="mb-4">
              Cada chisme tiene su propio contador de <b>pochocleadas</b> con el que se puede ver que tan popular es un chisme
            </p>
          </div>
          <div v-if="item.id === 5">
            <p class="mb-4">
              Las próximas funcionalidades que se van a estar lanzando son:
            </p>
            <p class="mb-4">
              1. Hilos, respuestas y comentarios (Lanzamiento: 26/07/2024)
            </p>
            <p class="mb-4">
              2. Follows entre usuarios (Lanzamiento: 31/07/2024)
            </p>
          </div>
        </template>
      </UAccordion>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

const items = ref([
  {
    id: 0,
    label: 'Código de conducta',
  },
  {
    id: 1,
    label: 'Creación de cuenta',
  },
  {
    id: 2,
    label: 'Eliminación de datos personales',
  },
  {
    id: 3,
    label: 'Reportar un post ofensivo',
  },
  {
    id: 4,
    label: 'Funcionalidades de la app',
  },
  {
    id: 5,
    label: 'Próximos lanzamientos',
  },
])

defineEmits(['close'])
</script>

<style lang="scss" scoped>
.app-help-modal {
  font-size: 0.85rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>