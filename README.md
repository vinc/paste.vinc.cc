# README

[Secure Markdown Pastebin][1]


## Cryptography

Pastes can be encrypted in the browser with a passphrase before being sent to
the server. The passphrase can be chosen by the user or randomly generated, in
any case it is never communicated to the server.

Client side cryptography is provided by [libsodium.js][2].


### [Random data generation][3]

- Source: [Web Cryptography API][4]


### [Secret-key authenticated encryption][5]

- Encryption: [Salsa20][6]
- Authentication: [Poly1305][7]


### [Key derivation][8]

- Function: [Scrypt][9]
- Parameters:
  - `memlimit`: 16 MB
  - `opslimit`: `memlimit` / 32


## License

Copyright (c) 2017 Vincent Ollivier. Released under MIT.


[1]: https://paste.vinc.cc
[2]: https://github.com/jedisct1/libsodium.js
[3]: https://download.libsodium.org/libsodium/content/generating_random_data/
[4]: https://developer.mozilla.org/en-US/docs/Web/API/RandomSource/getRandomValues
[5]: https://download.libsodium.org/libsodium/content/secret-key_cryptography/authenticated_encryption.html
[6]: https://en.wikipedia.org/wiki/Salsa20
[7]: https://en.wikipedia.org/wiki/Poly1305
[8]: https://download.libsodium.org/libsodium/content/password_hashing/scrypt.html
[9]: https://en.wikipedia.org/wiki/Scrypt
