# README

[Secure Markdown Pastebin][1]

[1]: https://paste.vinc.cc


## Markdown

Paste should be written in a [Markdown][2] format following the [CommonMark][3]
specification with some additions from [GitHub Flavored Markdown][4].

### Parsers

Markdown is rendered on the server or the client, depending on whether
encryption has been used or not.

- Server side: [redcarpet][5]
- Client side: [markdown-it][6]

### Rendering options:

- Filter HTML
- [Nofollow][7] on links

### Extensions:

- Fenced code blocks
- Autolink

[2]: http://daringfireball.net/projects/markdown/
[3]: http://commonmark.org/
[4]: https://github.github.com/gfm/
[5]: https://github.com/vmg/redcarpet
[6]: https://github.com/markdown-it/markdown-it
[7]: https://en.wikipedia.org/wiki/Nofollow


## Cryptography

Pastes can be encrypted in the browser with a passphrase before being sent to
the server. The passphrase can be chosen by the user or randomly generated, in
any case it is never communicated to the server.

Client side cryptography is provided by [libsodium.js][8].

### [Random data generation][9]

- Source: [Web Cryptography API][10]

### [Secret-key authenticated encryption][11]

- Encryption: [Salsa20][12]
- Authentication: [Poly1305][13]

### [Key derivation][14]

- Function: [Scrypt][15]
- Parameters:
  - `memlimit`: 16 MB
  - `opslimit`: `memlimit` / 32

[8]: https://github.com/jedisct1/libsodium.js
[9]: https://download.libsodium.org/libsodium/content/generating_random_data/
[10]: https://developer.mozilla.org/en-US/docs/Web/API/RandomSource/getRandomValues
[11]: https://download.libsodium.org/libsodium/content/secret-key_cryptography/authenticated_encryption.html
[12]: https://en.wikipedia.org/wiki/Salsa20
[13]: https://en.wikipedia.org/wiki/Poly1305
[14]: https://download.libsodium.org/libsodium/content/password_hashing/scrypt.html
[15]: https://en.wikipedia.org/wiki/Scrypt


## License

Copyright (c) 2017 Vincent Ollivier. Released under MIT.
