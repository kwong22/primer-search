/*
 * findprimers.js
 *
 * Gets sequence from textarea and identifies primers that can be used for
 * sequencing.
 *
 */

// ACGT Universal Primer List
// https://www.acgtinc.com/acgt-universal-primer-list/
var primerList = [
  {name: "3\' AD", sequence: "aga tgg tgc acg atg cac ag"},
  {name: "3 AOX1", sequence: "gca aat ggc att ctg aca tcc"},
  {name: "5\' AD", sequence: "ttc gat gat gaa gat acc cc"},
  {name: "5 AOX1", sequence: "gac tgg ttc caa ttg aca agc"},
  {name: "BGH Reverse", sequence: "tag aag gca cag tcg agg"},
  {name: "BK Reverse", sequence: "aca gga aac agc tat gac ctt g"},
  {name: "CAT-F", sequence: "atc cca atg gca tcg taa ag"},
  {name: "CAT-R", sequence: "aca gac ggc atg atg aac ct"},
  {name: "CMV Forward", sequence: "cgc aaa tgg gcg gta ggc gtg"},
  {name: "EF-1a Forward", sequence: "tca agc ctc aga cag tgg ttc"},
  {name: "GEX 3\'", sequence: "ccg gga gct gca tgt gtc aga gg"},
  {name: "GEX 3\'B", sequence: "caa gct gtg acc gtc tcc"},
  {name: "GEX 5\'", sequence: "ggg ctg gca agc cac gtt tgg tg"},
  {name: "GL Primer 1", sequence: "tgt atc tta tgg tac tgt aac tg"},
  {name: "GL Primer 2", sequence: "ctt tat gtt ttt ggc gtc ttc ca"},
  {name: "KS", sequence: "tcg agg tcg acg gta tc"},
  {name: "M13F (-20)", sequence: "gta aaa cga cgg cca gt"},
  {name: "M13F (-40)", sequence: "gtt ttc cca gtc acg ac"},
  {name: "M13R", sequence: "gga aac agc tat gac cat g"},
  {name: "myc-HIS Reverse", sequence: "atg acc ggt atg cat att cag"},
  {name: "pBAD Forward", sequence: "atg cca tag cat ttt tat cc"},
  {name: "pBAD Reverse", sequence: "gat tta atc tgt atc agg"},
  {name: "pET Upstream Primer", sequence: "atg cgt ccg gcg tag a"},
  {name: "pFastBac Forward", sequence: "gga tta ttc ata ccg tcc ca"},
  {name: "pFastBac Reverse", sequence: "caa atg tgg tat ggc tga tt"},
  {name: "pREP Forward", sequence: "gct cga tac aat aaa cgc c"},
  {name: "pRSET Reverse", sequence: "tag tta ttg ctc agc ggt gg"},
  {name: "pTrcHis Forward", sequence: "gag gta tat att aat gta tcg"},
  {name: "pTrcHis Reverse", sequence: "gat tta atc tgt atc agg"},
  {name: "pTRE 3\'", sequence: "cca cac ctc ccc ctg aac"},
  {name: "pTRE 5\'", sequence: "cgc ctg gag acg cca tcc"},
  {name: "QE Promoter", sequence: "ccg aaa agt gcc acc tg"},
  {name: "QE Reverse", sequence: "gtt ctg agg tca tta ctg g"},
  {name: "RV Primer 3", sequence: "cta gca aaa tag gct gtc cc"},
  {name: "RV Primer 4", sequence: "gac gat agt cat gcc ccg cg"},
  {name: "SK", sequence: "cta ggt gat caa gat ctc gc"},
  {name: "SP6", sequence: "gat tta ggt gac act ata g"},
  {name: "SP6 Promoter", sequence: "tat tta ggt gac act ata g"},
  {name: "T3", sequence: "aat taa ccc tca cta aag gg"},
  {name: "T7", sequence: "taa tac gac tca cta tag gg"},
  {name: "T7 Reverse", sequence: "tag tta ttg ctc agc ggt gg"},
  {name: "T7 Term", sequence: "gct agt tat tgc tca gcg g"},
  {name: "U19", sequence: "gtt ttc cca gtc acg acg t"},
  {name: "21TA", sequence: "ttt ttt ttt ttt ttt ttt ttt a"},
  {name: "21TC", sequence: "ttt ttt ttt ttt ttt ttt ttt c"},
  {name: "21TG", sequence: "ttt ttt ttt ttt ttt ttt ttt g"},
  {name: "1012F", sequence: "gct gac aga cta aca gac"},
  {name: "1012R", sequence: "gca aac aac aga tgg ctg gc"},
  {name: "XL39", sequence: "att agg aca agg ctg gtg gg"},
  {name: "V1.5", sequence: "gga ctt tcc aaa atg tcg"},
  {name: "3\' DNA-BD", sequence: "taa gag tca ctt taa aat ttg tat"},
  {name: "pTRE2-3\'", sequence: "cat tct aaa caa cac cct g"},
  {name: "T7EEV", sequence: "aag gct aga gta ctt aat acg a"},
  {name: "ACYCDuetUP1", sequence: "gga tct cga cgc tct ccc t"},
  {name: "DuetDOWN1", sequence: "gat tat gcg gcc gtg tac aa"},
  {name: "DuetUP2", sequence: "ttg tac acg gcc gca taa tc"},
  {name: "EGFP-C", sequence: "cat ggt cct gct gga gtt cgt g"},
  {name: "EGFP-N", sequence: "cgt cgc cgt cca gct cga cca g"}
];

// Genewiz Universal Primers
// https://www.genewiz.com/en/Public/Resources/Free-Universal-Primers
//var primerList = [
//  {name: "T7", sequence: "taa tac gac tca cta tag gg"},
//  {name: "T3", sequence: "att aac cct cac taa agg ga"},
//  {name: "SP6", sequence: "gat tta ggt gac act ata g"},
//  {name: "BGHR", sequence: "tag aag gca cag tcg agg"},
//  {name: "M13F(-21)", sequence: "tgt aaa acg acg gcc agt"},
//  {name: "M13F(-47)", sequence: "cgc cag ggt ttt ccc agt cac gac"},
//  {name: "M13R", sequence: "cag gaa aca gct atg ac"},
//  {name: "T7 Term", sequence: "gct agt tat tgc tca gcg g"},
//  {name: "CMV-Forward", sequence: "cgc aaa tgg gcg gta ggc gtg"},
//  {name: "5GEX", sequence: "ggg ctg gca agc cac gtt tgg tg"},
//  {name: "3GEX", sequence: "ccg gga gct gca tgt gtc aga gg"},
//  {name: "pFastBacF", sequence: "gga tta ttc ata ccg tcc ca"},
//  {name: "pFastBacR", sequence: "caa atg tgg tat ggc tga tt"},
//  {name: "pBAD Forward", sequence: "atg cca tag cat ttt tat cc"},
//  {name: "pBAD Reverse", sequence: "gat tta atc tgt atc agg"},
//  {name: "M13F(-41)", sequence: "ggt ttt ccc agt cac gac"},
//  {name: "T7 EEV", sequence: "atg tcg taa taa ccc cgc ccc g"},
//  {name: "V5", sequence: "acc gag gag agg gtt agg gat"},
//  {name: "Myc", sequence: "gca tca atg cag aag ctg atc tca"},
//  {name: "Neo-F", sequence: "cgt tgg cta ccc gtg ata tt"},
//  {name: "Neo-R", sequence: "tgg ata ctt tct cgg cag"},
//  {name: "EGFP-C", sequence: "cat ggt cct gct gga gtt cgt g"},
//  {name: "EGFP-N", sequence: "cgt cgc cgt cca gct cga cca"},
//  {name: "SV40pA-R", sequence: "gaa att tgt gat gct att gc"},
//  {name: "SV40-promoter", sequence: "tat tta tgc aga ggc cga gg"}
//];

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

    // Standardize the primers
    standardizePrimers();

    // Get matches using the standardized sequence and primers
    var matches = getMatches(seq, standardizedPrimerList);

    // Arrays for matches in forward and reverse directions
    var fMatches = [];
    var rMatches = [];

    // Sort matches into forward and reverse directions
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].start < matches[i].end) {
        fMatches.push(matches[i]);
      } else {
        rMatches.push(matches[i]);
      }
    }

    clearResult();
    updateResult(seq, fMatches, rMatches);
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

// Clears the error div
var clearError = function () {
  document.getElementById("error").innerHTML = "";
};

// Updates message in the error div
var updateError = function (errorMsg) {
  document.getElementById("error").innerHTML = errorMsg;
};

// Clears the result section
var clearResult = function () {
  document.getElementById("full-sequence").innerHTML = "";
  document.getElementById("length").innerHTML = "";

  clearPrimerTables();
};

// Updates full sequence and sequence length in the error div
var updateResult = function (sequence, forwardMatches, reverseMatches) {

  // Showing the full sequence takes up a lot of space
  //document.getElementById("full-sequence").innerHTML = sequence;

  document.getElementById("length").innerHTML = sequence.length + " bp";

  updatePrimerTables(forwardMatches, reverseMatches);
};

// Clears the primer tables
var clearPrimerTables = function () {

  // Clear forward primer table
  document.getElementById("fprimer-title").innerHTML = "";
  document.getElementById("forward-primers").innerHTML = "";

  // Clear reverse primer table
  document.getElementById("rprimer-title").innerHTML = "";
  document.getElementById("reverse-primers").innerHTML = "";
};

// Updates the primer tables
var updatePrimerTables = function (forwardMatches, reverseMatches) {

  // Update forward primer table
  document.getElementById("fprimer-title").innerHTML = "Forward Primers";
  document.getElementById("forward-primers").innerHTML = "<tr><th>Name</th><th>Position (bp)</th><th>Length (bp)</th><th>Sequence</th></tr>";

  // Loop through forward primers and add them to the table
  for (var i = 0; i < forwardMatches.length; i++) {
    var match = forwardMatches[i];
    var primer = standardizedPrimerList[match.primerInd];
    document.getElementById("forward-primers").innerHTML += "<tr><td>" + primer.name + "</td><td>" + match.start + " to " + match.end + "</td><td>" + primer.sequence.length + "</td><td>" + primer.sequence + "</td>";
  }

  // Update reverse primer table
  document.getElementById("rprimer-title").innerHTML = "Reverse Primers";
  document.getElementById("reverse-primers").innerHTML = "<tr><th>Name</th><th>Position (bp)</th><th>Length (bp)</th><th>Sequence</th></tr>";

  // Loop through reverse primers and add them to the table
  for (var i = 0; i < reverseMatches.length; i++) {
    var match = reverseMatches[i];
    var primer = standardizedPrimerList[match.primerInd];
    document.getElementById("reverse-primers").innerHTML += "<tr><td>" + primer.name + "</td><td>" + match.start + " to " + match.end + "</td><td>" + primer.sequence.length + "</td><td>" + primer.sequence + "</td>";
  }
};

