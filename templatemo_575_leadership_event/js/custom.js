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
const SUPABASE_URL = 'https://ghvdkcakzoygktaiynae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodmRrY2Frem95Z2t0YWl5bmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjE4MTEsImV4cCI6MjA3ODA5NzgxMX0.9q3ak7TDEGApTsmrG8KGrMFhceg0qKL-KJD3Hthp0Mg';

// --- PART 1: ANG KONEKSYON ---
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);


// Kinukuha natin ang mga elemento sa HTML gamit ang 'id'
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');

// Kinukumpirma natin na may contact form bago mag-add ng listener
if (contactForm) {
   contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Form submission intercepted!");

        submitButton.disabled = true;
        submitButton.innerText = 'Nagpapadala...';

        // Kunin ang data (GUMAGAMIT NG TAMANG IDS BASE SA HTML MO)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // --- ANG PAG-INSERT SA DATABASE ---
        const { data, error } = await db
  .from('messagedb')
  .insert([
    { 
      name: name, 
      email: email, 
      subject: subject, 
      message: message 
    }
  ]);

        // --- FEEDBACK ---
        if (error) {
            console.error('Supabase Error:', error);
            alert('Nagkaproblema sa pagpapadala: ' + error.message);
            submitButton.disabled = false;
            submitButton.innerText = 'Submit';
        } else {
            alert('Salamat! Natanggap na namin ang iyong mensahe.');
            contactForm.reset(); 
            submitButton.disabled = false;
            submitButton.innerText = 'Submit';
        }
    });
}