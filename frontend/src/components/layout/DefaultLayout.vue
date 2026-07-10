<script setup lang="ts">
/**
 * DefaultLayout — Permanent application shell.
 *
 * Structure:
 *   ┌─────────────────────────────────────────┐
 *   │  Header  (fixed, full-width, 64px)      │
 *   ├──────────┬──────────────────┬───────────┤
 *   │  Sidebar │  <slot />        │ Inspector │
 *   │  260/72  │  (scrollable)    │  316px    │
 *   │          │  auto-resizes    │ slides in │
 *   └──────────┴──────────────────┴───────────┘
 *
 * When Inspector opens: main content smoothly shifts left, inspector slides in.
 * When Inspector closes: main content smoothly expands, inspector slides out.
 * Animation: 200ms ease-in-out, synchronized between content and inspector.
 */

import { useUIStore } from '@/stores/ui'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import InspectorPanel from './InspectorPanel.vue'
import ContentContainer from './ContentContainer.vue'
import {
  HEADER_HEIGHT,
  MAIN_LEFT_EXPANDED,
  MAIN_LEFT_COLLAPSED,
  MAIN_RIGHT_RESERVED,
} from '@/utils/constants'

const ui = useUIStore()
</script>

<template>
  <div :class="{ dark: ui.dark }">
    <div
      class="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20"
      style="font-family: Inter, system-ui, sans-serif"
    >
      <div
        class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,122,255,.16),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(52,199,89,.10),transparent_28%)]"
      />
      <div
        class="pointer-events-none fixed inset-0 opacity-[0.035]"
        style="background-image: linear-gradient(rgba(0,0,0,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.7) 1px, transparent 1px); background-size: 24px 24px"
      />

      <AppHeader />
      <AppSidebar />

      <!-- Main content — dynamic right padding for inspector -->
      <main
        class="relative transition-all duration-[200ms] ease-in-out"
        :style="{
          paddingTop: `${HEADER_HEIGHT + 14}px`,
          paddingLeft: ui.sidebarCollapsed
            ? `${MAIN_LEFT_COLLAPSED}px`
            : `${MAIN_LEFT_EXPANDED}px`,
          paddingRight: ui.inspectorOpen
            ? `${MAIN_RIGHT_RESERVED}px`
            : '0px',
        }"
      >
        <ContentContainer>
          <slot />
        </ContentContainer>
      </main>

      <InspectorPanel />
    </div>
  </div>
</template>
