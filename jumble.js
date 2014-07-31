/**
 * Given a string, find all combinations of the letters in it.
 *
 * Words can be any length as long as they only use a given character
 * once; a string "aab" can return "aa" and "ab" but not "aaa".
 *
 * @return
 *  An object of words to bigram score.
 */
function find_combinations(input_string) {
  // @see http://en.wikipedia.org/wiki/Bigram#Bigram_Frequency_in_the_English_language
  // These are the frequency of how often two words letters togeather.
  // Using this, we can try to tell how "realstic" that a word is a word.
  // This doesn't work that well specially for shorter words -- try "ton".
  var english_bigrams = {
    'th': 1.52,
    'en': 0.55,
    'ng': 0.18,
    'he': 1.28,
    'ed': 0.53,
    'of': 0.16,
    'in': 0.94,
    'to': 0.52,
    'al': 0.09,
    'er': 0.94,
    'it': 0.50,
    'de': 0.09,
    'an': 0.82,
    'ou': 0.50,
    'se': 0.08,
    're': 0.68,
    'ea': 0.47,
    'le': 0.08,
    'nd': 0.63,
    'hi': 0.46,
    'sa': 0.06,
    'at': 0.59,
    'is': 0.46,
    'si': 0.05,
    'on': 0.57,
    'or': 0.43,
    'ar': 0.04,
    'nt': 0.56,
    'ti': 0.34,
    've': 0.04,
    'ha': 0.56,
    'as': 0.33,
    'ra': 0.04,
    'es': 0.56,
    'te': 0.27,
    'ld': 0.02,
    'st': 0.55,
    'et': 0.19,
    'ur': 0.02
  }

  var combinations = {};

  // First we sort the string alphabetically. This will allow us easily tell
  // if we've processed this prefix/string before  -- think "aaa" as example.
  // Sorting has a penelty (n log n) but being that so many words have duplicate
  // letters. seems worth it.
  input_string = input_string.split('').sort().join('');
  // This keeps track of what we've already processed so no need to relook.
  var seen = {};

  function _find_combinations(prefix, string) {
    // Break out if already processed this combination.
    if (prefix + ':' + string in seen) {
      return;
    }
    for (var i = 0; i < string.length; i++) {
      var new_string = prefix + string.charAt(i);
      // It's possible the string has already been added (with a different
      // remaining string), so no need to re-add if so.
      if (!(new_string in combinations)) {
        combinations[new_string] = prefix ? combinations[prefix] : 0;
        // See if the bigram of the last two letters is part of the common
        // english bigrams. If so, add the score.
        if (new_string.length > 1) {
          var bigram = new_string.slice(new_string.length - 2);
          // Add points for valid bigram.
          if (bigram in english_bigrams) {
            combinations[new_string] += english_bigrams[bigram];
          }
          // Could subtract points if the bigram isn't in common bigram, unsure
          // if that'd make it more realistic.
        }
      }
      // Create a string out of the remaining characters.
      var remaining = (i != 0 ? string.slice(0, i) : '') + (string.length > i+1 ? string.slice(i+1) : '');
      _find_combinations(new_string, remaining);
    }
    seen[prefix + ':' + string] = 1;
  }
  _find_combinations('', input_string);
  return combinations;
}

$(document).ready(function() {
  // Stash the commonly used selectors for easy reuse.
  var $string_input = $('#string')
  var $table = $('#combinations');
  var $found_words = $('#found-words');
  // Keeps track of the word currently being counted.
  var last_val = '';

  /**
   * Update the display table and found characters on input change.
   */
  function update_combinations_table() {
    var val = $string_input.val();
    // We only recalculate for new values.
    if (val && last_val != val) {
      last_val = val;
      var combinations = find_combinations(val);
      $table.html('<tbody><tr id="header"></tr><tr id="words"></tr></tbody>');
      var $header = $table.find('#header');
      var $words = $table.find('#words');
      // Keep track our columns for quick access.
      var $columns = new Array();
      // There will be as many rows as there are words.
      for (var i = 1; i <= val.length; i++) {
        $header.append('<th>' + i + (i == 1 ? ' letter' : ' letters') + '</th>');
        $words.append('<td id="word-length-' + i + '"><ul class="list-group"></ul></td>')
        $columns[i] = $words.find('#word-length-' + i);
      }
      // We want to show them by most probably, so sort it first
      // @see http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
      combinations_sorted = Object.keys(combinations).sort(function(a,b){return combinations[b] - combinations[a]});
      // Now we want to highlight what words are actual words, which we do with a word list.
      var words_in_dictionary = [];
      for (var i = 0; i < combinations_sorted.length; i++) {
        var word = combinations_sorted[i];
        var weight = combinations[word];
        var in_dictionary = false;
        // Add a badge for bigram score if it has one.
        var badge = weight ? '<span class="badge" title="The higher this number the more likely it is a word.">' + weight + '</span>' : '';
        if (dictionary != undefined && dictionary[word]) {
          words_in_dictionary.push(word);
          in_dictionary = true;
        }
        // Add the item, putting it as disabled if NOT in the dictionary.
        $columns[word.length].append('<li class="list-group-item ' + (in_dictionary ? '' : 'disabled') + '">' + badge + word + '</li>');
      }
      // Not that we're not sanatizing input here or above so possible to add new markup.
      // Being that it's going to be run locally once, that seems fine for now.
      if (words_in_dictionary.length) {
        $found_words.html('<div class="alert alert-success" role="alert">Words found in dictionary: ' + words_in_dictionary.join(', ') + '</div>')
      }
      else {
        $found_words.html('<div class="alert alert-danger" role="alert">No words match those in dictionary.</div>');
      }
    }
  }
  // We use both keyup and change as sometimes one misses the other.
  $string_input.keyup(update_combinations_table);
  $string_input.change(update_combinations_table);
});
