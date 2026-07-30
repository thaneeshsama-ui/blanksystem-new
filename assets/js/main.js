'use strict';

/**
 * BlankSystem site scripts.
 * No external dependencies, no analytics, no tracking.
 * Everything here only wires up interactions the markup already promises.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileOverlay();
  initScrollButtons();
  initReviewsSlider();
  initContactForm();
  initSubscribeForm();
});

/* -----------------------------------------------------------
   Mobile navigation overlay
----------------------------------------------------------- */
function initMobileOverlay() {
  const overlay = document.getElementById('mobileOverlay');
  if (!overlay) return;

  // Close the overlay automatically once a nav link inside it is used,
  // so the menu doesn't stay open over the section the user just picked.
  overlay.querySelectorAll('.mobile-overlay__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof overlay.close === 'function') {
        overlay.close();
      }
    });
  });
}

/* -----------------------------------------------------------
   "Scroll to section" buttons (Start Your Project, View Portfolio,
   Get Your Free Proposal, pricing plan buttons, etc.)
----------------------------------------------------------- */
function initScrollButtons() {
  const buttons = document.querySelectorAll('[data-scroll-to]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetSelector = button.getAttribute('data-scroll-to');
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // If a pricing button was clicked, pre-select "Get a Quote" and
      // let the visitor know which plan they were looking at.
      const plan = button.getAttribute('data-plan');
      if (plan) {
        const quoteRadio = document.querySelector(
          '#contact-request-types input[name="request-type"][value="Get a Quote"]'
        );
        if (quoteRadio) quoteRadio.checked = true;

        const messageField = document.getElementById('message');
        if (messageField && !messageField.value) {
          messageField.value = `Hi, I'm interested in the ${plan} plan. `;
        }
      }

      // Move focus to the section heading for keyboard/screen-reader users.
      const heading = target.querySelector('h1, h2');
      if (heading) {
        const hadTabIndex = heading.hasAttribute('tabindex');
        if (!hadTabIndex) heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
        if (!hadTabIndex) {
          heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
        }
      }
    });
  });
}

/* -----------------------------------------------------------
   Testimonials / reviews slider
----------------------------------------------------------- */
function initReviewsSlider() {
  const list = document.getElementById('reviews-slider-list');
  if (!list) return;

  const slides = Array.from(list.children);
  const prevButton = document.querySelector('[data-slider-arrow="prev"]');
  const nextButton = document.querySelector('[data-slider-arrow="next"]');
  const dots = Array.from(document.querySelectorAll('[data-slider-index]'));
  if (!slides.length) return;

  const getSlideStart = (slide) => slide.offsetLeft;

  const getCurrentIndex = () => {
    const scrollLeft = list.scrollLeft;
    let closest = 0;
    let closestDistance = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(getSlideStart(slide) - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    return closest;
  };

  const goToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[clamped];
    if (!slide) return;
    list.scrollTo({ left: getSlideStart(slide), behavior: 'smooth' });
  };

  const updateControls = () => {
    const current = getCurrentIndex();

    dots.forEach((dot) => {
      const dotIndex = Number(dot.getAttribute('data-slider-index'));
      dot.classList.toggle('is-current', dotIndex === current);
    });

    if (prevButton) prevButton.disabled = current <= 0;
    if (nextButton) nextButton.disabled = current >= slides.length - 1;
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => goToIndex(getCurrentIndex() - 1));
  }
  if (nextButton) {
    nextButton.addEventListener('click', () => goToIndex(getCurrentIndex() + 1));
  }
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToIndex(Number(dot.getAttribute('data-slider-index')));
    });
  });

  // Keep dots/arrows in sync when the visitor swipes or drags the slider.
  let ticking = false;
  list.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateControls();
      ticking = false;
    });
  });

  window.addEventListener('resize', () => updateControls());

  updateControls();
}

/* -----------------------------------------------------------
   Contact form
   Submits to Formspree (https://formspree.io/f/xeeydnrb) using
   fetch, so the visitor never leaves the page. No API keys or
   secrets are needed for this - Formspree's form endpoint is
   designed to be called directly from client-side code. We only
   show a success message once Formspree itself confirms the
   submission (response.ok), and on failure we leave the form
   filled in so nothing the visitor typed is lost.
----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitButton = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');
  const defaultButtonLabel = submitButton ? submitButton.textContent.trim() : 'Send Message';
  const CONTACT_EMAIL = 'blanksysagency@gmail.com';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(status, 'Please fill in the required fields before sending.', 'error');
      return;
    }

    if (submitButton.disabled) return; // guard against double submits

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setStatus(status, 'Sending your message…', 'info');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          setStatus(
            status,
            "Thanks - your message has been sent. We'll get back to you shortly.",
            'success'
          );
          form.reset();
          return;
        }

        // Formspree returns JSON with an "errors" array when something is wrong
        // (e.g. a field it rejected). Fall back to a generic message otherwise.
        return response
          .json()
          .catch(() => null)
          .then((data) => {
            const detail =
              data && Array.isArray(data.errors) && data.errors.length
                ? data.errors.map((error) => error.message).join(' ')
                : null;

            setStatus(
              status,
              detail ||
                `Something went wrong and your message wasn't sent. Please try again, or email us directly at ${CONTACT_EMAIL}.`,
              'error'
            );
          });
      })
      .catch(() => {
        setStatus(
          status,
          `We couldn't reach the server. Please check your connection and try again, or email us directly at ${CONTACT_EMAIL}.`,
          'error'
        );
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonLabel;
      });
  });
}

/* -----------------------------------------------------------
   Footer newsletter subscribe form
   No email marketing service is connected yet, so we validate the
   input and are upfront that signup isn't wired up rather than
   pretending the subscription went through.
----------------------------------------------------------- */
function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  const status = document.getElementById('subscribe-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(status, 'Please enter a valid email address.');
      return;
    }

    setStatus(
      status,
      "Thanks for your interest! Our newsletter signup isn't connected to an email service yet " +
        '- please reach out via the contact form or WhatsApp in the meantime.'
    );
  });
}

/* -----------------------------------------------------------
   Shared helper
----------------------------------------------------------- */
function setStatus(element, message, type = 'info') {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('visually-hidden', 'is-success', 'is-error');
  if (type === 'success') element.classList.add('is-success');
  if (type === 'error') element.classList.add('is-error');
}
