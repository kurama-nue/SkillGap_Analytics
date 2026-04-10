/**
 * Zustand store for 3D visualization filter state.
 */
import { create } from 'zustand';
import type { FilterState } from '../types';

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedDepartments: [],
  showSkillGapsOnly: false,
  highlightedEmployeeId: null,

  setSelectedDepartments: (depts) => set({ selectedDepartments: depts }),

  toggleDepartment: (dept) => {
    const { selectedDepartments } = get();
    if (selectedDepartments.includes(dept)) {
      set({ selectedDepartments: selectedDepartments.filter((d) => d !== dept) });
    } else {
      set({ selectedDepartments: [...selectedDepartments, dept] });
    }
  },

  setShowSkillGapsOnly: (v) => set({ showSkillGapsOnly: v }),

  setHighlightedEmployeeId: (id) => set({ highlightedEmployeeId: id }),

  reset: () =>
    set({
      selectedDepartments: [],
      showSkillGapsOnly: false,
      highlightedEmployeeId: null,
    }),
}));
