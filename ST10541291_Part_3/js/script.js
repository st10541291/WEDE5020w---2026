/* ============================================================
   Sipho's Custom Carpentry — JavaScript
   Handles: accordion, gallery lightbox, service search,
            enquiry form validation + response, contact form.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ============================================
       1. ACCORDION (Services page)
       ============================================ */
    const accordionButtons = document.querySelectorAll('.accordion-btn');

    accordionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const panel = this.nextElementSibling;
            const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';

            // Close all panels
            document.querySelectorAll('.accordion-panel').forEach(function (p) {
                p.style.maxHeight = '0px';
            });
            document.querySelectorAll('.accordion-btn').forEach(function (b) {
                b.setAttribute('aria-expanded', 'false');
                b.classList.remove('active');
            });

            // Open clicked one if it was closed
            if (!isOpen) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                this.setAttribute('aria-expanded', 'true');
                this.classList.add('active');
            }
        });
    });

    /* ============================================
       2. GALLERY LIGHTBOX (Services page)
       ============================================ */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.gallery-img').forEach(function (img) {
            img.addEventListener('click', function () {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
            });
        });

        lightboxClose.addEventListener('click', function () {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') lightbox.style.display = 'none';
        });
    }

    /* ============================================
       3. SERVICE SEARCH / FILTER (Services page)
       ============================================ */
    const searchInput = document.getElementById('serviceSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const items = document.querySelectorAll('.service-item');
            let visibleCount = 0;

            items.forEach(function (item) {
                const name = item.getAttribute('data-name').toLowerCase();
                const matches = name.includes(query) || item.textContent.toLowerCase().includes(query);
                item.style.display = matches ? 'flex' : 'none';
                if (matches) visibleCount++;
            });

            document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
        });
    }

    /* ============================================
       4. ENQUIRY FORM — Validation + Cost Response
       ============================================ */
    const enquiryForm = document.getElementById('enquiryForm');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateEnquiry()) {
                showEnquiryResponse();
            }
        });

        function validateEnquiry() {
            let valid = true;

            const name = document.getElementById('enqName');
            const email = document.getElementById('enqEmail');
            const phone = document.getElementById('enqPhone');
            const furniture = document.getElementById('enqFurniture');
            const material = document.getElementById('enqMaterial');

            clearError('enqNameError');
            clearError('enqEmailError');
            clearError('enqPhoneError');
            clearError('enqFurnitureError');
            clearError('enqMaterialError');

            if (name.value.trim().length < 2) {
                setError('enqName', 'enqNameError', 'Please enter your full name (min. 2 characters).');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                setError('enqEmail', 'enqEmailError', 'Please enter a valid email address.');
                valid = false;
            }
            if (!/^\d{10}$/.test(phone.value.trim())) {
                setError('enqPhone', 'enqPhoneError', 'Please enter a 10-digit phone number (e.g. 0821234567).');
                valid = false;
            }
            if (!furniture.value) {
                setError('enqFurniture', 'enqFurnitureError', 'Please select a furniture type.');
                valid = false;
            }
            if (!material.value) {
                setError('enqMaterial', 'enqMaterialError', 'Please select a material preference.');
                valid = false;
            }
            return valid;
        }

        function showEnquiryResponse() {
            const furniture = document.getElementById('enqFurniture').value;
            const material = document.getElementById('enqMaterial').value;
            const name = document.getElementById('enqName').value.split(' ')[0];

            // Simple cost estimates based on furniture type + material
            const basePrices = {
                'kitchen-cabinets': 8000,
                'wardrobe': 6000,
                'tv-stand': 3000,
                'other': 2500
            };
            const materialMultipliers = {
                'melamine': 1.0,
                'solid-wood': 1.8,
                'not-sure': 1.0
            };

            const base = basePrices[furniture] || 2500;
            const multiplier = materialMultipliers[material] || 1.0;
            const estimate = Math.round(base * multiplier);

            const response = document.getElementById('enquiryResponse');
            response.classList.add('show');
            response.innerHTML =
                '<strong>Thank you, ' + name + '!</strong><br>' +
                'We have received your enquiry for <strong>' + formatText(furniture) + '</strong> in <strong>' + formatText(material) + '</strong>.<br>' +
                'Estimated starting price: <strong>R' + estimate.toLocaleString('en-ZA') + '</strong> (final quote confirmed after site visit).<br>' +
                'We will contact you within 24 hours.';
            response.scrollIntoView({ behavior: 'smooth' });
            enquiryForm.reset();
        }

        function formatText(str) {
            return str.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        }
    }

    /* ============================================
       5. CONTACT FORM — Validation + Email Compilation
       ============================================ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateContact()) {
                sendContactEmail();
            }
        });

        function validateContact() {
            let valid = true;

            const name = document.getElementById('conName');
            const email = document.getElementById('conEmail');
            const type = document.getElementById('conType');
            const message = document.getElementById('conMessage');

            clearError('conNameError');
            clearError('conEmailError');
            clearError('conTypeError');
            clearError('conMessageError');

            if (name.value.trim().length < 2) {
                setError('conName', 'conNameError', 'Please enter your name.');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                setError('conEmail', 'conEmailError', 'Please enter a valid email address.');
                valid = false;
            }
            if (!type.value) {
                setError('conType', 'conTypeError', 'Please select a message type.');
                valid = false;
            }
            if (message.value.trim().length < 10) {
                setError('conMessage', 'conMessageError', 'Message must be at least 10 characters.');
                valid = false;
            }
            return valid;
        }

        function sendContactEmail() {
            const name = document.getElementById('conName').value;
            const email = document.getElementById('conEmail').value;
            const type = document.getElementById('conType').value;
            const message = document.getElementById('conMessage').value;

            const subject = encodeURIComponent('[Website Contact] ' + type.toUpperCase() + ' — ' + name);
            const body = encodeURIComponent(
                'Name: ' + name + '\n' +
                'Email: ' + email + '\n' +
                'Message Type: ' + type + '\n\n' +
                'Message:\n' + message
            );

            const mailtoLink = 'mailto:info@siphoscarpentry.co.za?subject=' + subject + '&body=' + body;

            const response = document.getElementById('contactResponse');
            response.classList.add('show');
            response.innerHTML =
                '<strong>Thank you, ' + name + '!</strong><br>' +
                'Your message is ready to send. <a href="' + mailtoLink + '">Click here to open it in your email app</a>, or copy the details below:<br><br>' +
                '<em>To: info@siphoscarpentry.co.za<br>Subject: ' + subject + '</em>';
            response.scrollIntoView({ behavior: 'smooth' });
            contactForm.reset();
        }
    }

    /* ============================================
       HELPERS
       ============================================ */
    function setError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.add('invalid');
        error.textContent = message;
    }

    function clearError(errorId) {
        const error = document.getElementById(errorId);
        error.textContent = '';
        if (error.previousElementSibling) {
            error.previousElementSibling.classList.remove('invalid');
        }
    }
});