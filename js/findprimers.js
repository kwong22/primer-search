/*
 * findprimers.js
 *
 * Gets sequence from textarea and identifies primers that can be used for
 * sequencing.
 *
 */

// Handle clicking of Submit button
var handleSubmit = function () {
  var seq = getSequence();

  clearError();

  var result = validateSequence(seq);

  if (!result.success) {
    updateError(result.message);
  } else {
    console.log("Sequence is valid.");
  }
}

var getSequence = function () {
  return document.getElementById("sequence").value;  
}

// Verifies that the input only contains A, G, C, and T
// Returns an object containing success flag and error message
var validateSequence = function (sequence) {

  // Remove all whitespace and make all uppercase
  var upper = sequence.replace(/\s/g, '').toUpperCase();

  // Check whether empty or not
  if (upper.length < 1) {
    return {success: false, message: "Error: Sequence cannot be empty."}
  }

  // Loop through entire string and check that all characters are valid
  // nucleotides.
  for (var i = 0; i < upper.length; i++) {
    switch (upper.charAt(i)) {
      case 'A':
      case 'G':
      case 'C':
      case 'T':
        break;
      default:
        return {success: false, message: "Error: Sequence contains invalid nucleotides."};
    }
  }

  return {success: true, message: ""};
}

// Clears the error div
var clearError = function () {
  document.getElementById("error").innerHTML = "";
}

// Updates message in the error div
var updateError = function (errorMsg) {
  document.getElementById("error").innerHTML = errorMsg;
}
