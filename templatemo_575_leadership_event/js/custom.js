"use strict";

// --- ORIGINAL JQUERY FUNCTIONS (NAHINTO DAHIL SA WRAPPER) ---
// Note: Dahil inalis natin ang wrapper, gumagamit na tayo ng "IIFE" para maayos na gumana ang mga ito.
(function ($) {
    // NAVBAR
    $('.navbar-nav .nav-link').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    // CUSTOM LINK SMOOTH SCROLL 
    $('.custom-link').click(function(){
        var el = $(this).attr('href');
        var elWrapped = $(el);
        var header_height = $('.navbar').height() + 10;

        scrollToDiv(elWrapped,header_height);
        return false;

        function scrollToDiv(element,navheight){
            var offset = element.offset();
            var offsetTop = offset.top;
            var totalScroll = offsetTop-navheight;

            $('body,html').animate({
            scrollTop: totalScroll
            }, 300);
        }
    });
})(window.jQuery); // Nilagay natin sa sarili nilang function para gumana pa rin ang jQuery

// =======================================================
// SUPABASE CONTACT FORM CODE (Ito ang kailangang tumakbo)
// =======================================================

// --- PART 1: ANG KONEKSYON ---
// =======================================================
// SUPABASE CLIENT
// =======================================================
const SUPABASE_URL = 'https://ghvdkcakzoygktaiynae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodmRrY2Frem95Z2t0YWl5bmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjE4MTEsImV4cCI6MjA3ODA5NzgxMX0.9q3ak7TDEGApTsmrG8KGrMFhceg0qKL-KJD3Hthp0Mg';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// =======================================================
// CONTACT FORM HANDLER
// =======================================================
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.innerText = 'Nagpapadala...';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const { error } = await db.from('messagedb').insert([{ name, email, subject, message }]);

    if (error) {
      console.error('Supabase Error:', error);
      alert('Nagkaproblema sa pagpapadala: ' + error.message);
    } else {
      alert('Salamat! Natanggap na namin ang iyong mensahe.');
      contactForm.reset();
    }

    submitButton.disabled = false;
    submitButton.innerText = 'Submit';
  });
}

// =======================================================
// BOOKING MODAL HANDLER
// =======================================================
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('booking-form');
const modalServiceName = document.getElementById('modal-service-name');
const modalServicePrice = document.getElementById('modal-service-price');
const bookingServiceInput = document.getElementById('booking-service');
const bookingPriceInput = document.getElementById('booking-price');
const bookingSubmitBtn = document.getElementById('booking-submit-btn');

if (bookingModal) {
  bookingModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    if (!button) return;

    const serviceName = button.getAttribute('data-service') || 'Unknown Service';
    const servicePrice = button.getAttribute('data-price') || '0';

    modalServiceName.textContent = serviceName;
    modalServicePrice.textContent = `₱${servicePrice}`;
    bookingServiceInput.value = serviceName;
    bookingPriceInput.value = servicePrice;
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    bookingSubmitBtn.disabled = true;
    bookingSubmitBtn.innerText = 'Sending Booking...';

    const bookingData = {
      service_name: bookingServiceInput.value.trim(),
      service_price: bookingPriceInput.value.trim(),
      customer_name: document.getElementById('booking-customer-name').value.trim(),
      contact_number: document.getElementById('booking-contact').value.trim(),
      email: document.getElementById('booking-email')?.value?.trim() || '', // safe check
      created_at: new Date().toISOString(),
    };

    if (!bookingData.customer_name || !bookingData.contact_number) {
      alert('Please fill out all required fields.');
      bookingSubmitBtn.disabled = false;
      bookingSubmitBtn.innerText = 'Confirm Booking';
      return;
    }

    try {
      const { error } = await db.from('bookings').insert([bookingData]);
      if (error) throw error;

      alert(`✅ Booking successful for ${bookingData.service_name}! We'll contact you soon.`);
      bookingForm.reset();

      const modalInstance = bootstrap.Modal.getInstance(bookingModal);
      if (modalInstance) modalInstance.hide();
    } catch (err) {
      console.error('Booking Error:', err);
      alert('❌ Booking failed: ' + err.message);
    } finally {
      bookingSubmitBtn.disabled = false;
      bookingSubmitBtn.innerText = 'Confirm Booking';
    }
  });
}
