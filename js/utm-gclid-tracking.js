/**
 * Persistent Google Click ID and UTM parameter tracking.
 * Captures from URL -> localStorage; injects hidden inputs + honeypot into all forms.
 */
(function() {
  "use strict";

  var PARAM_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var HONEYPOT_NAME = "website_url";
  var STORAGE_PREFIX = "ial_";

  function getStorageKey(name) {
    return STORAGE_PREFIX + name;
  }

  function captureUrlParams() {
    try {
      var q = window.location && window.location.search ? new URLSearchParams(window.location.search) : null;
      if (!q) return;
      for (var i = 0; i < PARAM_KEYS.length; i++) {
        var key = PARAM_KEYS[i];
        var val = q.get(key);
        if (val != null && val !== "") {
          try {
            localStorage.setItem(getStorageKey(key), val);
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  function getStoredValue(name) {
    try {
      var val = localStorage.getItem(getStorageKey(name));
      return val != null ? val : "";
    } catch (e) {
      return "";
    }
  }

  function ensureHiddenInput(form, name, value) {
    var existing = form.querySelector('input[name="' + name + '"]');
    if (existing) {
      existing.value = value;
      return;
    }
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function ensureHoneypot(form) {
    var existing = form.querySelector('input[name="' + HONEYPOT_NAME + '"]');
    if (existing) return;
    var input = document.createElement("input");
    input.type = "text";
    input.name = HONEYPOT_NAME;
    input.setAttribute("autocomplete", "off");
    input.setAttribute("tabindex", "-1");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.style.width = "1px";
    input.style.height = "1px";
    input.style.opacity = "0";
    input.setAttribute("aria-hidden", "true");
    form.appendChild(input);
  }

  function setupForm(form) {
    if (!form || form.nodeName !== "FORM") return;
    ensureHoneypot(form);
    for (var i = 0; i < PARAM_KEYS.length; i++) {
      var key = PARAM_KEYS[i];
      ensureHiddenInput(form, key, getStoredValue(key));
    }
    form.addEventListener("submit", function(e) {
      var hp = form.querySelector('input[name="' + HONEYPOT_NAME + '"]');
      if (hp && hp.value && hp.value.trim() !== "") {
        e.preventDefault();
        return false;
      }
    }, false);
  }

  function init() {
    var forms = document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) {
      setupForm(forms[i]);
    }
  }

  captureUrlParams();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
