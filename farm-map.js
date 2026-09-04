/*
 * Finca Turpial — interactive farm map (about.html)
 *
 * Uses Leaflet with L.CRS.Simple so we can plot a simple flat coordinate
 * system in meters instead of real-world GPS lat/lng. No external tile
 * server or API key is required.
 *
 * PLACEHOLDER NOTICE:
 * ------------------------------------------------------------------
 * The farm boundary below is a PLACEHOLDER square representing
 * "2 cuerdas" of land (1 cuerda ≈ 3,930.4 m², so 2 cuerdas ≈ 7,860.8 m²,
 * i.e. a square with sides of about 88.66 meters). It is NOT the real
 * farm boundary. Once a real KMZ/GeoJSON survey file is available for
 * Finca Turpial, replace the FARM_BOUNDARY and CROP_MARKERS data below
 * with coordinates parsed/converted from that file (e.g. via
 * togeojson or a KMZ->GeoJSON conversion step, then projected into the
 * same meter-based coordinate system, or swap this whole script for a
 * standard Leaflet GeoJSON layer with real lat/lng + L.CRS.EPSG3857).
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // CONFIG SECTION — swap this out when the real KMZ/GeoJSON is available
  // ---------------------------------------------------------------------

  // Side length (meters) of the placeholder square: sqrt(7860.8) ≈ 88.66m
  var CUERDA_SQUARE_SIDE_M = Math.sqrt(2 * 3930.4);

  // Placeholder farm boundary: a simple square, in [y, x] meter coordinates
  // with (0, 0) at the bottom-left corner. Replace with real boundary
  // polygon coordinates (converted to this same [y, x] space, or lat/lng
  // if switching to a standard tile-based map) once the KMZ is uploaded.
  var FARM_BOUNDARY = [
    [0, 0],
    [0, CUERDA_SQUARE_SIDE_M],
    [CUERDA_SQUARE_SIDE_M, CUERDA_SQUARE_SIDE_M],
    [CUERDA_SQUARE_SIDE_M, 0],
    [0, 0],
  ];

  // Placeholder crop/category marker locations, distributed within the
  // boundary square. Each entry maps a category to a [y, x] point, a
  // label, and the destination page. Replace coordinates with real
  // KMZ-derived points later; keep the same {coords, label, href} shape.
  var CROP_MARKERS = [
    {
      label: "Fruits",
      href: "fruits.html",
      coords: [CUERDA_SQUARE_SIDE_M * 0.75, CUERDA_SQUARE_SIDE_M * 0.25],
    },
    {
      label: "Vegetables",
      href: "vegetables.html",
      coords: [CUERDA_SQUARE_SIDE_M * 0.75, CUERDA_SQUARE_SIDE_M * 0.75],
    },
    {
      label: "Dragonfruit Plants",
      href: "dragonfruit-plants.html",
      coords: [CUERDA_SQUARE_SIDE_M * 0.25, CUERDA_SQUARE_SIDE_M * 0.25],
    },
    {
      label: "Other Consumables",
      href: "other-consumables.html",
      coords: [CUERDA_SQUARE_SIDE_M * 0.25, CUERDA_SQUARE_SIDE_M * 0.75],
    },
  ];

  // ---------------------------------------------------------------------
  // MAP SETUP — should not need changes when swapping in real boundary data
  // ---------------------------------------------------------------------

  function initFarmMap() {
    var mapEl = document.getElementById("farm-map");
    if (!mapEl || typeof L === "undefined") return;

    // CRS.Simple treats coordinates as plain [y, x] meters, no projection.
    var map = L.map(mapEl, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 4,
      zoomSnap: 0.25,
      attributionControl: false,
    });

    var padding = CUERDA_SQUARE_SIDE_M * 0.35;
    var bounds = [
      [-padding, -padding],
      [CUERDA_SQUARE_SIDE_M + padding, CUERDA_SQUARE_SIDE_M + padding],
    ];
    map.setMaxBounds(bounds);
    map.fitBounds([
      [0, 0],
      [CUERDA_SQUARE_SIDE_M, CUERDA_SQUARE_SIDE_M],
    ]);

    // Draw the placeholder farm boundary (dark gray + amber accent theme).
    L.polygon(FARM_BOUNDARY, {
      color: "#a87436",
      weight: 3,
      fillColor: "#302823",
      fillOpacity: 0.55,
    })
      .addTo(map)
      .bindTooltip("Farm boundary (placeholder — 2 cuerdas ≈ 7,860.8 m²)");

    // Custom amber marker icon to match the site theme.
    var farmIcon = L.divIcon({
      className: "farm-map-pin",
      html: '<span class="farm-map-pin-dot"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      tooltipAnchor: [0, -14],
    });

    CROP_MARKERS.forEach(function (marker) {
      var leafletMarker = L.marker(marker.coords, {
        icon: farmIcon,
        keyboard: true,
        alt: marker.label,
      }).addTo(map);

      leafletMarker.bindTooltip(marker.label, {
        permanent: false,
        direction: "top",
        className: "farm-map-tooltip",
      });

      leafletMarker.on("click", function () {
        window.location.href = marker.href;
      });

      // Keyboard accessibility: Enter/Space navigates like a click.
      leafletMarker.on("keypress", function (e) {
        if (e.originalEvent && (e.originalEvent.key === "Enter" || e.originalEvent.key === " ")) {
          window.location.href = marker.href;
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFarmMap);
  } else {
    initFarmMap();
  }
})();
