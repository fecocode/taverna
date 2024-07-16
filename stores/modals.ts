import { defineStore } from 'pinia'

export const useModalsStore = defineStore({
  id: 'modalsStore',
  state: () => ({
    isTermsAndConditionsModalOpen: false,
    isPrivacyPolicyModalOpen: false,
    isHelpModalOpen: false,
    isNewPostModalOpen: false,
    isSignInModalOpen: false,
    isSignUpModalOpen: false,
    isRickRollModalOpen: false,
  }),
  actions: {
    openRickRollModal() {
      this.isRickRollModalOpen = true
    },
    openTermsAndConditionsModal() {
      this.isTermsAndConditionsModalOpen = true
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
  },
})
