"use strict";

function lpad0(text, length) {
  // Take this, NPM.
  while (length > text.length) {
    text = '0'.concat(text);
  }

  return text;
}

function maybeCountryFlag(cc) {
  if (!/^[A-Z]{2}$/.test(cc)) return '';
  return String.fromCodePoint(0x1F1A5 + cc.charCodeAt(0)) +
    String.fromCodePoint(0x1F1A5 + cc.charCodeAt(1)) + ' ';
}


function onIDChange(e) {
  // Empty addresses don't deserve an error.
  if (!this.value.length) {
    document.getElementById('error').innerText = '';
    document.getElementById('results').style.display = 'none';
    return;
  }

  // We only work with valid 24-bit IDs.
  var addrValid = /^[0-9a-fA-F]{6}$/.test(this.value);

  if (!addrValid) {
    document.getElementById('error').innerText =
      'Address ' + this.value + ' is not a hex ICAO24 address.';
    document.getElementById('results').style.display = 'none';

    document.getElementById('id').innerText = '';
    document.getElementById('country').innerText = '';
    document.getElementById('tail_number').innerText = '';
    return;
  }

  var icao24 = Number.parseInt(this.value, 16);

  // Look up the address details if we think we have an ICAO24.
  var lookup = Address.Lookup(icao24);
  var addressHex = lpad0(icao24.toString(16), 6).toUpperCase();
  var addressBin = lpad0(icao24.toString(2), 24);

  // Make the results bookmarkable.
  window.location.hash = window.encodeURIComponent(addressHex);

  // If we know something about the aircraft..
  if (lookup) {
    document.getElementById('error').innerText = '';
    document.getElementById('results').style.display = null;

    document.getElementById('id').innerText =
      addressHex + ' (hex)\n' +
      addressBin.substr(0, lookup.prefix.length) + ' ' +
      addressBin.substr(lookup.prefix.length);

    document.getElementById('country').innerText =
      maybeCountryFlag(lookup.country_code) +
      lookup.location_name + ' (' + lookup.country_code + ')\n' +
      lookup.location_name + ' has been allocated ' +
      Math.pow(2, 24 - lookup.prefix.length) + ' aircraft addresses.';

    // Depending on the country, we may be able to decode a tail number.
    if (!lookup.tail_algorithm) {
      document.getElementById('tail_number').innerText =
        'No tail number mapping for ' + lookup.location_name + ' is known.';
    } else {
      // If the country has a mapping, give it a go.
      var tailno = lookup.tail_algorithm(icao24);

      if (tailno) {
        document.getElementById('tail_number').innerText = tailno;
      } else {
        // Not all values have a valid tail number, especially for the 32- and
        // 64-bit packings of tail ID.
        document.getElementById('tail_number').innerText =
          'Could not determine a tail number - is the address valid?';
      }
    }
  } else {
    // Clear everything on no results.
    document.getElementById('error').innerText =
      'We don\'t know anything about address ' + addressHex + '.';
    document.getElementById('results').style.display = 'none';

    document.getElementById('id').innerText = '';
    document.getElementById('country').innerText = '';
    document.getElementById('tail_number').innerText = '';
  }
}

function onHashChange(e) {
  // Handle URL editing, or bookmark clicks with the page open.
  var hash = window.location.hash ?
    window.decodeURIComponent(window.location.hash.substr(1)) : null;

  // But only try to decode real ICAO24s. Bad links don't get attention.
  if (/^[0-9A-Fa-f]{6}$/.test(hash)) {
    // Don't update the URL if only the case differs; this is to avoid
    // a lower-case UI entry causing us to uppercase the text box value and
    // reset the cursor position.
    if (hash.toLowerCase() !=
        document.getElementById('address').value.toLowerCase()) {
      document.getElementById('address').value = hash;
    }

    // Update the results text.
    onIDChange.bind(document.getElementById('address'))();
  }
}

window.addEventListener('load', function() {
  document.getElementById('address').addEventListener('change', onIDChange);
  document.getElementById('address').addEventListener('input', onIDChange);
  window.addEventListener('hashchange', onHashChange);

  onHashChange();
});
