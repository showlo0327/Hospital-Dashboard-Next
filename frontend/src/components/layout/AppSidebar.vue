<script setup lang="ts">
import { ChevronLeft, Menu } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import BuildingTree from '@/components/navigation/BuildingTree.vue'
import ModuleNav from '@/components/navigation/ModuleNav.vue'

const ui = useUIStore()
</script>

<template>
  <aside
    class="fixed bottom-0 left-0 z-30 flex hidden flex-col border-r border-border bg-sidebar/82 backdrop-blur-2xl transition-[width] duration-200 ease-in-out lg:flex"
    :class="ui.sidebarCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'"
    style="top: var(--header-height)"
  >
    <!-- Collapse button — VS Code style, overlaps right edge -->
    <button
      class="absolute -right-3 top-[10px] z-50 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/90 text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-150 hover:bg-white hover:text-foreground hover:shadow-md dark:bg-[#1c2230]/90 dark:hover:bg-[#252d3b]"
      :title="ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="ui.toggleSidebar()"
    >
      <Menu v-if="ui.sidebarCollapsed" :size="15" />
      <ChevronLeft v-else :size="14" />
    </button>

    <!-- Scrollable navigation area -->
    <div
      class="flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-3"
      style="scrollbar-width: thin; scrollbar-color: transparent transparent"
    >
      <BuildingTree :collapsed="ui.sidebarCollapsed" />
      <ModuleNav :collapsed="ui.sidebarCollapsed" />
    </div>

  </aside>
</template>

<style scoped>
aside div::-webkit-scrollbar {
  width: 4px;
}
aside div::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}
aside div:hover::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
}
</style>
