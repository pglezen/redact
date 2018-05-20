Redact
======

Redact the contents of each line of a file according to
rules expressed as JSON.  The following sample is from
`sampleRules.json`.

```
[
  { startingAt:  3, replaceWith: "TTTT" },
  { startingAt: 15, replaceWith: "VVV", padding: 7 }
]
```

The `startingAt` index is zero-based.  The above means
that for for each line of the input file:

- starting at column 4, overwrite content with `TTTT`
- starting at column 16, overwrite content with `VVV    `.
  If necessary, pad with extra space so that at least 7
  characters are overwritten);
- If the field replacement exceeds the line length, truncate
  the replacement so that line length is preserved.
- The optional padding attribute means pad to the right with spaces
  until the string length is the size indicated (according to
  `String.prototype.padEnd()`).

Invoke as

```
node redact sampleRules.json sampleInput.txt > redactedFile.txt
```

Here is the result run on the sample.

```
$ cat sampleInput.txt
This is a test file.  We need some long lines.
It is use to test a redaction utility. Good luck.
A short line.
$ node redact sampleRules.json sampleInput.txt
ThiTTTT a teVVV       We need some long lines.
It TTTTse toVVV       daction utility. Good luck.
A sTTTT lineV
```

Error and warning messages are written to standard error.
They will not appear in the result file if standard output
is redirected.
