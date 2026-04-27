(function() {
  var phone = "844-467-4335";
  var pageType = document.body.getAttribute("data-page-type") || "catastrophic_case_review";
  var adGroup = document.body.getAttribute("data-ad-group") || "";
  window.dataLayer = window.dataLayer || [];
  try {
    var query = location.search ? new URLSearchParams(location.search) : null;
    if (query) {
      ["gclid","gbraid","wbraid","utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(key) {
        var value = query.get(key);
        if (value) localStorage.setItem("ial_" + key, value);
      });
    }
  } catch (e) {}
  window.dataLayer.push({
    event: "ppc_landing_page_view",
    page_type: pageType,
    campaign_theme: "catastrophic_case_discovery",
    ad_group: adGroup
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener("click", function() {
      window.dataLayer.push({
        event: "phone_click",
        phone_number: phone,
        page_path: location.pathname,
        page_type: pageType
      });
    });
  });
  setTimeout(function() {
    window.dataLayer.push({ event: "engaged_30s", page_type: pageType });
  }, 30000);
  var scroll90Fired = false;
  window.addEventListener("scroll", function() {
    var height = document.documentElement.scrollHeight || 1;
    if (!scroll90Fired && (window.scrollY + window.innerHeight) / height >= 0.9) {
      scroll90Fired = true;
      window.dataLayer.push({ event: "scroll_90", page_type: pageType });
    }
  }, { passive: true });
})();
