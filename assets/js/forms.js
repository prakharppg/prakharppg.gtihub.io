(function () {
  function isConfigured(config) {
    return config &&
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !config.supabaseUrl.includes('YOUR_PROJECT_ID') &&
      !config.supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');
  }

  function setStatus(target, type, message) {
    if (!target) return;
    target.className = `form-status alert alert-${type}`;
    target.textContent = message;
    target.hidden = false;
  }

  function clearStatus(target) {
    if (!target) return;
    target.hidden = true;
    target.textContent = '';
    target.className = 'form-status';
  }

  function slugify(value) {
    return String(value || 'file')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'file';
  }

  function setLoading(button, isLoading, defaultText) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Submitting...' : defaultText;
  }

  function createClient() {
    const config = window.supabaseConfig;
    if (!window.supabase || !isConfigured(config)) return null;
    const { createClient } = window.supabase;
    return createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  async function handleBrandSubmit(client, form) {
    const statusEl = form.querySelector('[data-form-status]');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.textContent.trim();
    const honeypot = form.elements.company_website?.value?.trim();

    clearStatus(statusEl);

    if (honeypot) {
      setStatus(statusEl, 'success', 'Thanks! Your request has been received.');
      form.reset();
      return;
    }

    setLoading(submitButton, true, buttonText);

    const payload = {
      full_name: form.elements.full_name.value.trim(),
      mobile: form.elements.mobile.value.trim(),
      email: form.elements.email.value.trim(),
      address: form.elements.address.value.trim() || null,
      product_type: form.elements.product_type.value.trim() || null,
      budget_range: form.elements.budget_range.value || null,
      service_required: form.elements.service_required.value,
      source_page: window.location.pathname,
      status: 'new'
    };

    const { error } = await client.from('brand_inquiries').insert(payload);

    setLoading(submitButton, false, buttonText);

    if (error) {
      setStatus(statusEl, 'danger', 'Submission failed. Please try again after checking your Supabase setup.');
      console.error(error);
      return;
    }

    form.reset();
    setStatus(statusEl, 'success', 'Thanks! Your brand inquiry has been submitted successfully.');
  }

  async function handleArtistSubmit(client, form) {
    const statusEl = form.querySelector('[data-form-status]');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.textContent.replace(/\s+/g, ' ').trim();
    const honeypot = form.elements.company_website?.value?.trim();

    clearStatus(statusEl);

    if (honeypot) {
      setStatus(statusEl, 'success', 'Thanks! Your registration has been received.');
      form.reset();
      return;
    }

    const photo = form.elements.photo.files[0];
    if (!photo) {
      setStatus(statusEl, 'warning', 'Please upload your photo before submitting.');
      return;
    }

    setLoading(submitButton, true, buttonText);

    let photoPath = null;
    let photoUrl = null;
    const extension = photo.name.split('.').pop();
    const filename = `${Date.now()}-${slugify(form.elements.full_name.value)}.${extension}`;
    const bucket = window.supabaseConfig.artistPhotoBucket || 'artist-photos';

    const uploadResult = await client.storage.from(bucket).upload(`artist-submissions/${filename}`, photo, {
      cacheControl: '3600',
      upsert: false
    });

    if (uploadResult.error) {
      setLoading(submitButton, false, buttonText);
      setStatus(statusEl, 'danger', 'Photo upload failed. Please verify storage bucket setup in Supabase.');
      console.error(uploadResult.error);
      return;
    }

    photoPath = uploadResult.data.path;
    photoUrl = client.storage.from(bucket).getPublicUrl(photoPath).data.publicUrl;

    const payload = {
      full_name: form.elements.full_name.value.trim(),
      profession: form.elements.profession.value,
      mobile: form.elements.mobile.value.trim(),
      email: form.elements.email.value.trim(),
      city: form.elements.city.value.trim(),
      instagram_url: form.elements.instagram_url.value.trim() || null,
      youtube_url: form.elements.youtube_url.value.trim() || null,
      facebook_url: form.elements.facebook_url.value.trim() || null,
      portfolio_url: form.elements.portfolio_url.value.trim() || null,
      expected_price: form.elements.expected_price.value.trim() || null,
      photo_path: photoPath,
      photo_url: photoUrl,
      source_page: window.location.pathname,
      status: 'new'
    };

    const { error } = await client.from('artist_registrations').insert(payload);

    setLoading(submitButton, false, buttonText);

    if (error) {
      setStatus(statusEl, 'danger', 'Registration failed. Please try again after checking your Supabase setup.');
      console.error(error);
      return;
    }

    form.reset();
    setStatus(statusEl, 'success', 'Thanks! Your artist registration has been submitted successfully.');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const brandForm = document.getElementById('brandInquiryForm');
    const artistForm = document.getElementById('artistRegistrationForm');
    if (!brandForm && !artistForm) return;

    const client = createClient();

    if (!client) {
      [brandForm, artistForm].filter(Boolean).forEach((form) => {
        const statusEl = form.querySelector('[data-form-status]');
        setStatus(statusEl, 'warning', 'Supabase is not configured yet. Add your project URL and anon key in assets/js/supabase-config.js.');
      });
      return;
    }

    if (brandForm) {
      brandForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!brandForm.reportValidity()) return;
        await handleBrandSubmit(client, brandForm);
      });
    }

    if (artistForm) {
      artistForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!artistForm.reportValidity()) return;
        await handleArtistSubmit(client, artistForm);
      });
    }
  });
})();
