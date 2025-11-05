export const initModal = () => {
  const modalTriggers = document.querySelectorAll<HTMLElement>('[data-modal-open]');

  modalTriggers.forEach(trigger => {
    const modalId = trigger.dataset.modalOpen;
    const modal = document.getElementById(modalId!) as HTMLDialogElement | null;
    if (modal) {
      trigger.addEventListener('click', () => {
        modal.showModal()
        document.dispatchEvent(new CustomEvent('modal:toggle', {
          detail: { isOpen: true }
        }));
      });
    }
  });
};