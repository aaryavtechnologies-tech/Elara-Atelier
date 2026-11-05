/**
 * ELARA ATELIER - Booking Engine Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingEngine();
});

function initBookingEngine() {
  const form = document.getElementById('appointment-form');
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
  const stylistRadios = document.querySelectorAll('input[name="stylist"]');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const selectedTimeInput = document.getElementById('selected-time-slot');
  const dateInput = document.getElementById('booking-date');

  // Summary elements
  const summaryServicesList = document.getElementById('summary-services-list');
  const summaryStylist = document.getElementById('summary-stylist');
  const summaryDateTime = document.getElementById('summary-date-time');

  // Confirmation modal elements
  const modal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalRef = document.getElementById('modal-ref-id');
  const modalClientName = document.getElementById('modal-client-name');
  const modalService = document.getElementById('modal-services');
  const modalDateTime = document.getElementById('modal-time');
  const modalStylist = document.getElementById('modal-stylist');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');

  // Set default min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Handle URL query parameters for pre-selected service
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedService = urlParams.get('service');
  if (preSelectedService) {
    serviceCheckboxes.forEach(cb => {
      if (cb.value.toLowerCase().includes(preSelectedService.toLowerCase())) {
        cb.checked = true;
      }
    });
  }

  const preSelectedStylist = urlParams.get('stylist');
  if (preSelectedStylist) {
    stylistRadios.forEach(radio => {
      if (radio.value.toLowerCase().includes(preSelectedStylist.toLowerCase())) {
        radio.checked = true;
      }
    });
  }

  // Update summary calculation
  function updateSummary() {
    let selectedServices = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const name = cb.getAttribute('data-name');
        selectedServices.push(name);
      }
    });

    if (summaryServicesList) {
      if (selectedServices.length === 0) {
        summaryServicesList.innerHTML = '<span style="color: var(--text-dim);">No service selected yet</span>';
      } else {
        summaryServicesList.innerHTML = selectedServices
          .map(name => `<div><i class="fa-solid fa-circle-check gold-text" style="font-size: 0.75rem; margin-right: 5px;"></i> ${name}</div>`)
          .join('');
      }
    }

    // Stylist
    let chosenStylist = 'Any Master Stylist';
    stylistRadios.forEach(radio => {
      if (radio.checked) {
        chosenStylist = radio.value;
      }
    });
    if (summaryStylist) summaryStylist.innerText = chosenStylist;

    // Date & Time
    const chosenDate = dateInput ? dateInput.value : '';
    const chosenTime = selectedTimeInput ? selectedTimeInput.value : 'Not selected';
    if (summaryDateTime) {
      if (chosenDate && chosenTime) {
        const formattedDate = new Date(chosenDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        summaryDateTime.innerText = `${formattedDate} at ${chosenTime}`;
      } else {
        summaryDateTime.innerText = `${chosenDate || 'Date'} at ${chosenTime}`;
      }
    }

    return { selectedServices, chosenStylist, chosenDate, chosenTime };
  }

  // Event Listeners for controls
  serviceCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));
  stylistRadios.forEach(radio => radio.addEventListener('change', updateSummary));
  if (dateInput) dateInput.addEventListener('change', updateSummary);

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const time = btn.getAttribute('data-time');
      if (selectedTimeInput) selectedTimeInput.value = time;
      updateSummary();
    });
  });

  // Initial calculation
  updateSummary();

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const { selectedServices, chosenStylist, chosenDate, chosenTime } = updateSummary();

      if (selectedServices.length === 0) {
        alert('Please select at least one service for your appointment.');
        return;
      }

      if (!chosenTime || chosenTime === 'Not selected') {
        alert('Please select a preferred time slot.');
        return;
      }

      const clientName = document.getElementById('client-name')?.value || 'Guest';
      const clientPhone = document.getElementById('client-phone')?.value || '';
      const clientEmail = document.getElementById('client-email')?.value || '';
      const clientGender = document.getElementById('client-gender')?.value || 'Not specified';
      const clientNotes = document.getElementById('client-notes')?.value || 'None';

      // Generate reference ID (e.g. ELARA-8492)
      const refId = 'ELARA-' + Math.floor(1000 + Math.random() * 9000);

      // Populate modal
      if (modalRef) modalRef.innerText = refId;
      if (modalClientName) modalClientName.innerText = clientName;
      if (modalService) modalService.innerText = selectedServices.join(', ');
      if (modalStylist) modalStylist.innerText = chosenStylist;
      if (modalDateTime) modalDateTime.innerText = `${chosenDate} at ${chosenTime}`;

      // Construct WhatsApp URL without prices
      const serviceNames = selectedServices.join(', ');
      const message = `Hello Elara Atelier! 👋\nI would like to confirm my appointment booking:\n\n*Booking ID:* ${refId}\n*Name:* ${clientName}\n*Phone:* ${clientPhone}\n*Gender:* ${clientGender}\n*Services:* ${serviceNames}\n*Stylist:* ${chosenStylist}\n*Date & Time:* ${chosenDate} at ${chosenTime}\n*Notes:* ${clientNotes}\n\nPlease confirm availability. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      let targetPhone = '919820358282';
      if (chosenStylist.toLowerCase().includes('dildar')) {
        targetPhone = '919555234427';
      }

      if (modalWhatsappBtn) {
        modalWhatsappBtn.href = `https://wa.me/${targetPhone}?text=${encodedMessage}`;
      }

      // Show modal
      if (modal) modal.classList.add('show');
    });
  }

  // Close modal
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }
}
