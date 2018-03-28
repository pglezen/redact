Redact
======

Redact contents of each line of a file according to some simple
rules expressed as JSON.

```
[ 
  { startingAt:  3, replaceWith: "WXYZ" },
  { startingAt: 15, replaceWith: "QRS", padding: 7 }
]
```

The index is zero-based.  The above means the following for each line:

- starting at column 4, overwrite content with "WXYZ"
- starting at column 16, overwrite content with "QRS    " (note the extra spac);
- If line is not long enough, truncate replacement
  (preserve length of each line).
- The optional padding attribute means pad to the right with spaces 
  until the string length is the size indicated (according to 
  `String.prototype.padEnd()`).
 
Invoke as 

```
node redact.js sampleRules.json abc.txt > redactedFile.txt
```

