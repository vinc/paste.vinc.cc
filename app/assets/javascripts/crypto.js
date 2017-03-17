var Crypto = {
  generatePassphrase: function() {
    return sodium.to_hex(sodium.randombytes_buf(24));
  },

  deriveKey: function(passphrase, salt) {
    var keyLength = sodium.crypto_secretbox_KEYBYTES;
    var ops = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
    var mem = sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE / 2;
    var algo = sodium.crypto_pwhash_ALG_DEFAULT;

    return sodium.crypto_pwhash(keyLength, passphrase, salt, ops, mem, algo);
  },

  encrypt: function(plaintext, passphrase) {
    var saltLength = sodium.crypto_pwhash_SALTBYTES;
    var nonceLength = sodium.crypto_secretbox_NONCEBYTES;

    var salt = sodium.randombytes_buf(saltLength);
    var key = this.deriveKey(passphrase, salt);

    var nonce = sodium.randombytes_buf(nonceLength);
    var bytes = sodium.crypto_secretbox_easy(plaintext, nonce, key);
    var array = new Uint8Array(saltLength + nonceLength + bytes.length);
    array.set(salt);
    array.set(nonce, saltLength);
    array.set(bytes, saltLength + nonceLength);
    return sodium.to_base64(array);
  },

  decrypt: function(ciphertext, passphrase) {
    var saltLength = sodium.crypto_pwhash_SALTBYTES;
    var nonceLength = sodium.crypto_secretbox_NONCEBYTES;

    var array = sodium.from_base64(ciphertext);
    var nonce = array.slice(saltLength, saltLength + nonceLength);
    var bytes = array.slice(saltLength + nonceLength);

    var salt = array.slice(0, saltLength);
    var key = this.deriveKey(passphrase, salt);

    return sodium.crypto_secretbox_open_easy(bytes, nonce, key, 'text');
  }
};
