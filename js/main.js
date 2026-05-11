(function () {
  "use strict";

  var WA = "https://wa.me/79658858777";
  var TG = "https://t.me/+79658858777";
  var TEL = "tel:+79658858777";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* Mobile nav */
  var burger = qs(".burger");
  var drawer = qs(".mobile-drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      drawer.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    qsa(".mobile-drawer a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        drawer.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Accordion */
  qsa(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var open = item.classList.contains("is-open");
      qsa(".acc-item.is-open").forEach(function (i) {
        i.classList.remove("is-open");
      });
      if (!open) item.classList.add("is-open");
    });
  });

  /* Modal callback */
  var modalBackdrop = qs("#modal-callback");
  function openModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.add("is-open");
      modalBackdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }
  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove("is-open");
      modalBackdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }
  qsa("[data-open-callback]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });
  qsa("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  var callbackForm = qs("#form-callback");
  if (callbackForm) {
    callbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = qs("[name=phone]", callbackForm).value.trim();
      var text = encodeURIComponent(
        "Здравствуйте! Прошу перезвонить. Телефон: " + (phone || "не указан")
      );
      window.location.href = WA + "?text=" + text;
      closeModal();
    });
  }

  /* Lead form -> WhatsApp */
  var leadForm = qs("#form-lead");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = qs("[name=name]", leadForm);
      var phone = qs("[name=phone]", leadForm);
      var msg = qs("[name=message]", leadForm);
      var parts = [
        "Заявка с сайта",
        name && name.value ? "Имя: " + name.value : "",
        phone && phone.value ? "Телефон: " + phone.value : "",
        msg && msg.value ? "Комментарий: " + msg.value : "",
      ].filter(Boolean);
      window.location.href = WA + "?text=" + encodeURIComponent(parts.join(". "));
    });
  }

  /* Repair calculator */
  var calcForm = qs("#calc-repair");
  if (calcForm) {
    function runCalc() {
      var area = parseFloat(qs("[name=area]", calcForm).value) || 0;
      var tier = qs("[name=tier]", calcForm).value;
      var base = tier === "design" ? 18500 : tier === "business" ? 12500 : 8500;
      var opts = 0;
      if (qs("[name=opt_elec]", calcForm).checked) opts += 1200;
      if (qs("[name=opt_sant]", calcForm).checked) opts += 1100;
      if (qs("[name=opt_dem]", calcForm).checked) opts += 800;
      var perM2 = base + opts;
      var low = Math.round(area * perM2 * 0.92);
      var high = Math.round(area * perM2 * 1.08);
      var out = qs("#calc-result", calcForm.parentElement);
      if (out) {
        if (area < 10) {
          out.textContent =
            "Укажите площадь от 10 м² для ориентировочного расчёта. Точную смету подготовим после осмотра.";
        } else {
          out.textContent =
            "Ориентировочный бюджет: от " +
            low.toLocaleString("ru-RU") +
            " до " +
            high.toLocaleString("ru-RU") +
            " ₽. Итог зависит от объёма скрытых работ и материалов — зафиксируем в договоре после замеров.";
        }
      }
    }
    calcForm.addEventListener("input", runCalc);
    calcForm.addEventListener("change", runCalc);
    runCalc();
  }

  /* Lightbox */
  var lb = qs("#lightbox");
  var lbImg = qs("#lightbox-img");
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  qsa("[data-lightbox]").forEach(function (imgWrap) {
    var img = qs("img", imgWrap) || imgWrap;
    if (img.tagName !== "IMG") return;
    imgWrap.addEventListener("click", function () {
      if (!lb || !lbImg) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.hasAttribute("data-close-lightbox")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }

  /* Smooth anchor offset for fixed header */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#") return;
    var id = a.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: "smooth" });
    if (burger && drawer && drawer.classList.contains("is-open")) {
      burger.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  /* Expose wa/tg helpers for inline buttons without href */
  window.__SITE = { wa: WA, tg: TG, tel: TEL };
})();
