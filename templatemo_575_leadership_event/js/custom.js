

  
  "use strict";

    // NAVBAR
    $('.navbar-nav .nav-link').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    // CUSTOM LINK 
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
    

// =======================================================
// SUPABASE CONTACT FORM CODE
// =======================================================

// --- PART 1: ANG KONEKSYON ---
// I-paste mo dito 'yung nakuha mong URL at 'anon public' key
const SUPABASE_URL = 'https://ghvdkcakzoygktaiynae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodmRrY2Frem95Z2t0YWl5bmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjE4MTEsImV4cCI6MjA3ODA5NzgxMX0.9q3ak7TDEGApTsmrG8KGrMFhceg0qKL-KJD3Hthp0Mg';

// Gumagawa tayo ng 'client' o 'koneksyon'
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Kinukuha natin ang mga elemento sa HTML gamit ang 'id'
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');

// Kapag pinindot ang 'Submit' button sa loob ng form...
contactForm.addEventListener('submit', async (event) => {
    // Pinipigilan natin ang page na mag-refresh
    event.preventDefault();

    // I-disable ang button para maiwasan ang double-send
    submitButton.disabled = true;
    submitButton.innerText = 'Nagpapadala...';

    // Kunin ang data mula sa mga input fields
    // (Siguraduhin na ang HTML mo ay may mga 'id' na ito)
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // --- ANG PAG-INSERT SA DATABASE ---
    const { data, error } = await supabase
        .from('messagedb') // Siguraduhin na 'messagedb' ang pangalan ng table mo
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
        // Kung may error, sabihin sa user
        alert('Nagkaproblema: ' + error.message);
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
    } else {
        // Kung successful, sabihin sa user at linisin ang form
        alert('Salamat! Natanggap na namin ang iyong mensahe.');
        contactForm.reset(); 
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
    }
});

// =======================================================
// END OF SUPABASE CODE
// =======================================================

