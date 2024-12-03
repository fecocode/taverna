export default defineAppConfig({
  ui: {
    popover: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800'
    },
    card: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
      divide: 'divide-y divide-zinc-700 dark:divide-zinc-800'
    },
    divider: {
      border: {
        base: 'border-zinc-800 dark:border-zink-800',
      }
    },
    tooltip: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
    },
    modal: {
      overlay: {
        base: 'fixed inset-0 transition-opacity backdrop-blur-sm',
        background: 'bg-zinc-200/75 dark:bg-zinc-950/75'
      }
    },
    button: {
      color: {
        gray: {
          ghost: 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-zink-400',
          soft: 'text-gray-700 dark:text-gray-200 dark:bg-zinc-800 hover:text-gray-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-zink-400',
        },
        sky: {
          ghost: 'text-sky-800 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-zink-400',
          soft: 'text-sky-800 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-500 bg-zinc-50 dark:bg-zinc-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-zink-400',
        }
      }
    },
    alert: {
      color: {
        white: {
          solid: 'text-gray-900 dark:text-white bg-white dark:bg-zinc-900 ring-1 ring-gray-200 dark:ring-zinc-800',
        }
      }
    },
    badge: {
      color: {
        gray: {
          solid: 'ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-gray-700 dark:text-gray-200 bg-zinc-50 dark:bg-zinc-900',
        },
      }
    },
    notification: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
    },
  }
})