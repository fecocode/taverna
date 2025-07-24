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
    <h2 class="text-2xl font-semibold mb-4">Política de Privacidad de Taberna</h2>
    <p class="mb-4">En Taberna, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y compartimos tus datos cuando utilizas nuestra aplicación móvil y sitio web ("la App").</p>

    <h3 class="text-lg font-semibold mb-2">1. Datos Personales Recopilados</h3>
    <p class="mb-4">Recopilamos y almacenamos información personal limitada, que incluye:</p>
    <ul class="list-disc pl-6 mb-4">
        <li>Nombre de usuario</li>
        <li>Dirección de correo electrónico</li>
        <li>Contraseña (segurizada por nuestro proveedor Clerk)</li>
    </ul>

    <h3 class="text-lg font-semibold mb-2">2. Uso de Cookies</h3>
    <p class="mb-4">Utilizamos las cookies proporcionadas por Clerk para mantener la sesión iniciada. Estas cookies son esenciales para el funcionamiento de la autenticación y no utilizamos ninguna otra tecnología de seguimiento adicional.</p>

    <h3 class="text-lg font-semibold mb-2">3. Compartición de Datos</h3>
    <p class="mb-4">Compartimos tus datos personales con los siguientes proveedores de servicios para garantizar el funcionamiento y mejora de la App:</p>
    <ul class="list-disc pl-6 mb-4">
        <li><span class="font-semibold">Google</span>: Utilizamos Firebase para almacenamiento y servicios en la nube.</li>
        <li><span class="font-semibold">Render</span>: Utilizamos una base de datos Redis alojada en Render.</li>
        <li><span class="font-semibold">Vercel</span>: La App está desplegada en Vercel.</li>
        <li><span class="font-semibold">Clerk</span>: Provee servicios de autenticación.</li>
    </ul>

    <h3 class="text-lg font-semibold mb-2">4. Uso de Datos</h3>
    <p class="mb-4">Utilizamos tus datos personales para:</p>
    <ul class="list-disc pl-6 mb-4">
        <li>El funcionamiento de la App.</li>
        <li>Mejorar nuestros servicios.</li>
        <li>Personalizar tu experiencia en la App.</li>
    </ul>

    <h3 class="text-lg font-semibold mb-2">5. Control de Datos por Parte del Usuario</h3>
    <p class="mb-4">Los datos recopilados son los mínimos necesarios para el funcionamiento de la App. Sin embargo, los usuarios pueden solicitar la modificación, eliminación o envío de sus datos personales en cualquier momento. Para ello, deben enviar una solicitud al correo electrónico <a href="mailto:apps@fecocode.com" class="text-blue-500 hover:underline">apps@fecocode.com</a> y resolveremos la situación dentro de las 72 horas hábiles.</p>

    <h3 class="text-lg font-semibold mb-2">6. Retención de Datos</h3>
    <p class="mb-4">Retenemos tus datos personales mientras mantengas una cuenta activa en Taberna. Si decides eliminar tu cuenta, eliminaremos todos tus datos personales de nuestros sistemas.</p>

    <h3 class="text-lg font-semibold mb-2">7. Seguridad de los Datos</h3>
    <p class="mb-4">Nos comprometemos a proteger tus datos personales mediante medidas de seguridad adecuadas. Toda la información personal que recopilamos está cifrada para garantizar su protección.</p>

    <h3 class="text-lg font-semibold mb-2">8. Transferencias Internacionales de Datos</h3>
    <p class="mb-4">En principio, tus datos personales solo se comparten con los proveedores mencionados anteriormente, que pueden estar ubicados en distintos países. Nos aseguramos de que cualquier transferencia de datos cumpla con las leyes de protección de datos aplicables.</p>

    <h3 class="text-lg font-semibold mb-2">9. Cambios en la Política de Privacidad</h3>
    <p class="mb-4">Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te notificaremos cualquier cambio significativo a través de la App o por correo electrónico.</p>

    <p class="mb-4">Si tienes alguna pregunta o inquietud sobre nuestra política de privacidad, no dudes en contactarnos en <a href="mailto:apps@fecocode.com" class="text-blue-500 hover:underline">apps@fecocode.com</a>.</p>

  </UCard>
</template>

<script lang="ts" setup>
defineEmits(['close'])
</script>

<style>

</style>