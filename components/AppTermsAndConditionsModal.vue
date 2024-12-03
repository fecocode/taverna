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
    <h2 class="text-2xl font-semibold mb-4">Términos y Condiciones de Uso de Hackgento</h2>

    <p class="mb-4">Bienvenido a Hackgento. Al acceder y utilizar nuestra aplicación móvil y sitio web ("la App"), aceptas cumplir con estos términos y condiciones de uso ("Términos").</p>

    <h3 class="text-lg font-semibold mb-2">1. Uso de la App</h3>
    <p class="mb-4">La App está destinada para la creación, edición, eliminación y seguimiento de chismes entretenidos y de interés. Al utilizar la App, aceptas cumplir con nuestro código de conducta y todas las leyes locales aplicables.</p>

    <h3 class="text-lg font-semibold mb-2">2. Contenido y Propiedad Intelectual</h3>
    <ul class="list-disc pl-6 mb-4">
        <li><span class="font-semibold">Propiedad del Contenido:</span> Los usuarios conservan los derechos de propiedad intelectual sobre el contenido que publican en Hackgento.</li>
        <li><span class="font-semibold">Licencia para Hackgento:</span> Al publicar contenido en la App, los usuarios otorgan a Hackgento una licencia mundial, no exclusiva, sublicenciable y transferible para usar, reproducir, distribuir y mostrar dicho contenido dentro de la App y para promocionar la App. Esta licencia permite a Hackgento modificar, adaptar, traducir y crear obras derivadas del contenido con el fin de operar y promover la App.</li>
    </ul>

    <h3 class="text-lg font-semibold mb-2">3. Privacidad y Seguridad</h3>
    <ul class="list-disc pl-6 mb-4">
        <li><span class="font-semibold">Datos Personales:</span> Recopilamos y almacenamos información personal limitada, incluyendo nombre de usuario, dirección de correo electrónico y contraseña segurizada. El contenido de los chismes creados, editados o eliminados, junto con la fecha y el autor, también se almacena y puede ser público sin restricciones.</li>
        <li><span class="font-semibold">Seguridad:</span> Los datos personales de nuestros usuarios están protegidos mediante cifrado y nuestras bases de datos están aseguradas para proteger la información almacenada.</li>
    </ul>

    <h3 class="text-lg font-semibold mb-2">4. Modificaciones y Notificaciones</h3>
    <p class="mb-4">Nos reservamos el derecho de actualizar estos Términos en cualquier momento. Los cambios significativos serán notificados a los usuarios por correo electrónico.</p>

    <h3 class="text-lg font-semibold mb-2">5. Jurisdicción y Ley Aplicable</h3>
    <p class="mb-4">Estos Términos se rigen e interpretan de acuerdo con las leyes de la República Argentina. Cualquier disputa que surja en relación con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes en Argentina.</p>

    <h3 class="text-lg font-semibold mb-2">6. Limitación de Responsabilidad</h3>
    <p class="mb-4">En la medida máxima permitida por la ley aplicable, Hackgento no será responsable por ningún daño directo, indirecto, incidental, especial, emergente o punitivo que surja del uso de la App, incluso si se ha advertido sobre la posibilidad de tales daños.</p>
  </UCard>
</template>

<script lang="ts" setup>
defineEmits(['close'])
</script>

<style>

</style>