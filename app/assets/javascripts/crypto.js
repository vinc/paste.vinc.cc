var Crypto = {
  generatePassphrase: function() {
    return sodium.to_hex(sodium.randombytes_buf(24));
  },

  deriveKey: function(passphrase) {
    var length = sodium.crypto_secretbox_KEYBYTES;
    var salt = sodium.from_hex($('meta[name=crypto-salt]').attr('content'));
    var ops = sodium.crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_INTERACTIVE;
    var mem = sodium.crypto_pwhash_scryptsalsa208sha256_MEMLIMIT_INTERACTIVE;

    return sodium.crypto_pwhash_scryptsalsa208sha256(length, passphrase, salt, ops, mem);
  },

  encrypt: function(plaintext, passphrase) {
    var nonceLength = sodium.crypto_secretbox_NONCEBYTES;

    var key = this.deriveKey(passphrase);

    var nonce = sodium.randombytes_buf(nonceLength);
    var bytes = sodium.crypto_secretbox_easy(plaintext, nonce, key);
    var array = new Uint8Array(nonceLength + bytes.length);
    array.set(nonce, 0);
    array.set(bytes, nonceLength);
    return sodium.to_base64(array);
  },

  decrypt: function(ciphertext, passphrase) {
    var nonceLength = sodium.crypto_secretbox_NONCEBYTES;

    var array = sodium.from_base64(ciphertext);
    var nonce = array.slice(0, nonceLength);
    var bytes = array.slice(nonceLength);

    var key = this.deriveKey(passphrase);

    return sodium.crypto_secretbox_open_easy(bytes, nonce, key, 'text');
  }
};
