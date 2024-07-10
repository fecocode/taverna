import { defineStore } from 'pinia'

export const useModalsStore = defineStore({
  id: 'modalsStore',
  state: () => ({
    isTermsAndConditionsModalOpen: false,
    isPrivacyPolicyModalOpen: false,
    isHelpModalOpen: false,
    isRankingModalOpen: false,
    isSignInModalOpen: false,
    isSignUpModalOpen: false,
  }),
  actions: {
    openTermsAndConditionsModal() {
      this.isTermsAndConditionsModalOpen = true
    },
    openPrivacyPolicyModal() {
      this.isPrivacyPolicyModalOpen = true
    },
    openHelpModal() {
      this.isHelpModalOpen = true
    },
    openRankingModal() {
      this.isRankingModalOpen = true
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
    closeRankingModal(){
      this.isRankingModalOpen = false
    },
    closeSignInModal(){
      this.isSignInModalOpen = false
    },
    closeSignUpModal(){
      this.isSignUpModalOpen = false
    },
  },
})
