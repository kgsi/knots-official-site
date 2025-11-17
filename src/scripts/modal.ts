export const initModal = () => {
  const modalTriggers = document.querySelectorAll<HTMLElement>('[data-modal-open]');
  const closeBtn = Array.from(document.querySelectorAll(`[data-trigger="modal-close"]`));
  const modals = Array.from(document.querySelectorAll('dialog'));

  const openModal = (modal: HTMLDialogElement) => {
    modal.showModal()
    document.dispatchEvent(new CustomEvent('modal:toggle', {
      detail: { isOpen: true }
    }));

  }

  const closeModal = async (modal: HTMLDialogElement): Promise<void> => {
    modal.close()
    document.dispatchEvent(new CustomEvent('modal:toggle', {
      detail: { isOpen: false }
    }));
  }

  modalTriggers.forEach(trigger => {
    const modalId = trigger.dataset.modalOpen;
    const modal = document.getElementById(modalId!) as HTMLDialogElement | null;
    if (modal) {
      trigger.addEventListener('click', () => {
        openModal(modal);
      });
    }
  });

  closeBtn?.forEach(btn => {
    const modal = btn.closest('dialog') as HTMLDialogElement;
    if (modal) {
      btn.addEventListener('click', () => {
        closeModal(modal);
      });
    }
  });

  modals?.forEach(modal => {
    modal.addEventListener('click', (event) => handleBackdropClick(event, modal));
    modal.addEventListener('cancel', () => {
      document.dispatchEvent(new CustomEvent('modal:toggle', {
        detail: { isOpen: false }
      }));
    });
  })
  const handleBackdropClick = (event: MouseEvent, modal: HTMLDialogElement): void => {
    const target = modal.querySelector('.container');
    if (!target?.contains(event.target as Node)) {
      closeModal(modal);
    }
  };

};