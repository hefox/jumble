<?php

$files = array(
  'american-words.10',
  'american-words.20',
  'american-words.35',
  'american-words.40',
  'american-words.50',
  'american-words.55',
  'english-words.10',
  'english-words.20',
  'english-words.35',
  'english-words.40',
  'english-words.50',
  'english-words.55',
  'english-words.60',
);

$words = array();
$output = 'var dictionary = {' . "\n";
$allow_single_letters =  array('a', 'i');
foreach ($files as $file) {
  foreach (file('scowl/final/' . $file) as $word) {
    $word = strtolower(trim($word));
    // For some reason these lists include every letter of the alaphabet.
    // Exclude them cept for I, a.
    if (strlen($word) == 1 && !in_array($word, $allow_single_letters)) {
      continue;
    }
    $output .= '  "' . $word . '": "' . $word . '",' . "\n";
  }
}
echo $output . "};";