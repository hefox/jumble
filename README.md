Bigram Jumble
============

This program will find the words in a jumble of letters. It tries identifying the words two ways

1. Dictionary lookup: match a word to a precreated dictionary. The dictionary is a .js file with an object of all words (object for O(1) key lookup). It's not using ajax to load the files because of issues in loading locally. 
2. Bigrams: it compares the bigrams in the word to english frequency to try and gives each word a score. As can be seen comparing to dictionary, this has varying results.

To run it, either set it on a server like any other html or just access it via file:// in a web browser (
Tested with current stable chrome).

It's using CDN hosted versions of jquery and bootstrap so an internet connection is needed.

