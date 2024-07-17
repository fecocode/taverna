import { defineStore } from 'pinia'

export const useModalsStore = defineStore({
  id: 'modalsStore',
  state: () => ({
    isTermsAndConditionsModalOpen: false,
    isRulesModalOpen: false,
    isPrivacyPolicyModalOpen: false,
    isHelpModalOpen: false,
    isNewPostModalOpen: false,
    isSignInModalOpen: false,
    isSignUpModalOpen: false,
    isRickRollModalOpen: false,
    isDeletePostModalOpen: false,
    isEditPostModalOpen: false,
    isRepentanceModalOpen: false,
    isReportModalOpen: false
  }),
  actions: {
    openRickRollModal() {
      this.isRickRollModalOpen = true
    },
    openDeletePostModal() {
      this.isDeletePostModalOpen = true
    },
    openEditPostModal() {
      this.isEditPostModalOpen = true
    },
    openTermsAndConditionsModal() {
      this.isTermsAndConditionsModalOpen = true
    },
    openRepentanceModal() {
      this.isRepentanceModalOpen = true
    },
    openReportModal() {
      this.isReportModalOpen = true
    },
    openRulesModal() {
      this.isRulesModalOpen = true
    },
    openPrivacyPolicyModal() {
      this.isPrivacyPolicyModalOpen = true
    },
    openHelpModal() {
      this.isHelpModalOpen = true
    },
    openNewPostModal() {
      this.isNewPostModalOpen = true
    },
    openSignInModal() {
      this.isSignInModalOpen = true
    },
    openSignUpModal() {
      this.isSignUpModalOpen = true
    },
    closeTermsAndConditionsModal(){
      this.isTermsAndConditionsModalOpen = false
    },
    closeRulesModal(){
      this.isRulesModalOpen = false
    },
    closeRepentanceModal(){
      this.isRepentanceModalOpen = false
    },
    closeReportModal(){
      this.isRepentanceModalOpen = false
    },
    closePrivacyPolicyModal(){
      this.isPrivacyPolicyModalOpen = false
    },
    closeHelpModal(){
      this.isHelpModalOpen = false
    },
    closeNewPostModal(){
      this.isNewPostModalOpen = false
    },
    closeSignInModal(){
      this.isSignInModalOpen = false
    },
    closeSignUpModal(){
      this.isSignUpModalOpen = false
    },
    closeDeletePostModal() {
      this.isDeletePostModalOpen = false
    },
    closeEditPostModal() {
      this.isEditPostModalOpen = false
    },
  },
})
