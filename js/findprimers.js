/*
 * findprimers.js
 *
 * Gets sequence from textarea and identifies primers that can be used for
 * sequencing.
 *
 */

// ACGT Universal Primer List
// https://www.acgtinc.com/acgt-universal-primer-list/
//var primerList = [
//  {name: "3\' AD", sequence: "AGA TGG TGC ACG ATG CAC AG"},
//  {name: "3 AOX1", sequence: "GCA AAT GGC ATT CTG ACA TCC"},
//  {name: "5\' AD", sequence: "TTC GAT GAT GAA GAT ACC CC"}
//];

// Genewiz Universal Primers
// https://www.genewiz.com/en/Public/Resources/Free-Universal-Primers
var primerList = [
  {name: "T7", sequence: "taa tac gac tca cta tag gg"},
  {name: "T3", sequence: "att aac cct cac taa agg ga"},
  {name: "SP6", sequence: "gat tta ggt gac act ata g"},
  {name: "BGHR", sequence: "tag aag gca cag tcg agg"},
  {name: "M13F(-21)", sequence: "tgt aaa acg acg gcc agt"},
  {name: "M13F(-47)", sequence: "cgc cag ggt ttt ccc agt cac gac"},
  {name: "M13R", sequence: "cag gaa aca gct atg ac"},
  {name: "T7 Term", sequence: "gct agt tat tgc tca gcg g"},
  {name: "CMV-Forward", sequence: "cgc aaa tgg gcg gta ggc gtg"},
  {name: "5GEX", sequence: "ggg ctg gca agc cac gtt tgg tg"},
  {name: "3GEX", sequence: "ccg gga gct gca tgt gtc aga gg"},
  {name: "pFastBacF", sequence: "gga tta ttc ata ccg tcc ca"},
  {name: "pFastBacR", sequence: "caa atg tgg tat ggc tga tt"},
  {name: "pBAD Forward", sequence: "atg cca tag cat ttt tat cc"},
  {name: "pBAD Reverse", sequence: "gat tta atc tgt atc agg"},
  {name: "M13F(-41)", sequence: "ggt ttt ccc agt cac gac"},
  {name: "T7 EEV", sequence: "atg tcg taa taa ccc cgc ccc g"},
  {name: "V5", sequence: "acc gag gag agg gtt agg gat"},
  {name: "Myc", sequence: "gca tca atg cag aag ctg atc tca"},
  {name: "Neo-F", sequence: "cgt tgg cta ccc gtg ata tt"},
  {name: "Neo-R", sequence: "tgg ata ctt tct cgg cag"},
  {name: "EGFP-C", sequence: "cat ggt cct gct gga gtt cgt g"},
  {name: "EGFP-N", sequence: "cgt cgc cgt cca gct cga cca"},
  {name: "SV40pA-R", sequence: "gaa att tgt gat gct att gc"},
  {name: "SV40-promoter", sequence: "tat tta tgc aga ggc cga gg"}
];

// Global variable to store the standardized versions of the primers
var standardizedPrimerList = [];

// Handle clicking of Submit button
var handleSubmit = function () {


  // Retrieve and standardize the sequence
  var seq = standardizeSequence(getSequence());

  clearError();

  var result = validateSequence(seq);

  if (!result.success) {
    updateError(result.message);
  } else {
    console.log("Sequence is valid.");

    // Standardize the primers
    standardizePrimers();

    // Get matches using the standardized sequence and primers
    var matches = getMatches(seq, standardizedPrimerList);

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      console.log(primerList[match.primerInd].name + " start: " + match.start + ", end: " + match.end);
    }
  }
};

var getSequence = function () {
  return document.getElementById("sequence").value;  
};

var standardizeSequence = function (sequence) {

  // Remove all whitespace and make all uppercase
  return sequence.replace(/\s/g, '').toUpperCase();
};

var standardizePrimers = function () {
  
  // Clear current list
  standardizedPrimerList = [];

  // Loop through all primers in primerList and store standardized versions in
  // standardizedPrimerList
  for (var i = 0; i < primerList.length; i++) {
    var primer = primerList[i];
    standardizedPrimerList.push({name: primer.name,
      sequence: standardizeSequence(primer.sequence)});
  }
};

// Verifies that the input only contains A, G, C, and T
// Returns an object containing success flag and error message
var validateSequence = function (sequence) {

  // Check whether empty or not
  if (sequence.length < 1) {
    return {success: false, message: "Error: Sequence cannot be empty."}
  }

  // Loop through entire string and check that all characters are valid
  // nucleotides.
  for (var i = 0; i < sequence.length; i++) {
    switch (sequence.charAt(i)) {
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
};

// Returns an array of matches
// index of primer, start index, end index
var getMatches = function (sequence, primers) {

  // Store primer matches
  var matches = [];


  // Loop through all primers
  for (var i = 0; i < primers.length; i++) {

    var primer = primers[i].sequence;

    // Store previously found index to keep track of absolute index
    var prevInd = 0;

    // Check for primer in forward strand
    var fSeq = sequence;
    while (fSeq.indexOf(primer) != -1) {
      var index = fSeq.indexOf(primer);

      // Adjust indices by 1 to make them easier to understand
      matches.push({primerInd: i,
        start: prevInd + index + 1,
        end: prevInd + index + primer.length});

      // Check the rest of the sequence
      prevInd += index + primer.length;
      fSeq = fSeq.slice(index + primer.length, fSeq.length);
    }

    prevInd = 0;

    // Check for primer in complementary strand
    var rSeq = complementStrand(sequence);
    while (rSeq.indexOf(primer) != -1) {
      var index = rSeq.indexOf(primer);

      // Adjust indices by 1 to make them easier to understand
      matches.push({primerInd: i,
        start: sequence.length - (prevInd + index),
        end: sequence.length - (prevInd + index + primer.length) + 1});

      // Check the rest of the sequence
      prevInd += index + primer.length;
      rSeq = rSeq.slice(index + primer.length, rSeq.length);
    }
  }

  return matches;
};

// Clears the error div
var clearError = function () {
  document.getElementById("error").innerHTML = "";
};

// Updates message in the error div
var updateError = function (errorMsg) {
  document.getElementById("error").innerHTML = errorMsg;
};

// Returns complementary strand
var complementStrand = function (string) {
  var reverse =  string.split("").reverse().join("");

  var complement = [];
  
  // Loop through reverse strand and add complementary bases to complement
  for (var i = 0; i < reverse.length; i++) {
    switch (reverse[i]) {
      case 'A':
        complement.push('T');
        break;
      case 'T':
        complement.push('A');
        break;
      case 'G':
        complement.push('C');
        break;
      case 'C':
        complement.push('G');
        break;
      default:
    }
  }

  return complement.join("");
};
