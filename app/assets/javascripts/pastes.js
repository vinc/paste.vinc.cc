$(document).on('turbolinks:load', function() {
  $('[name=generate-passphrase]').click(function() {
    var passphrase = CryptoJS.lib.WordArray.random(32).toString();

    $('[name=passphrase]').val(passphrase);
  });

  $('#new_paste').submit(function() {
    var plaintext = $('[name=plaintext]').val();
    var passphrase = $('[name=passphrase]').val();

    if (passphrase.length > 0) {
      var ciphertext = CryptoJS.AES.encrypt(plaintext, passphrase).toString();

      $('[name="paste[content]"]').val(ciphertext);
      $('[name="paste[encrypted]"]').val(true);
    } else {
      $('[name="paste[content]"]').val(plaintext);
      $('[name="paste[encrypted]"]').val(false);
    }

    // Don't send local data to server
    $('[name=plaintext]').prop('disabled', true);
    $('[name=passphrase]').prop('disabled', true);
  });

  var contentDiv = $('.content');
  if (contentDiv.length) {
    if (contentDiv.data('encrypted')) {
      var ciphertext = contentDiv.text();
      var passphrase = window.location.hash.slice(1);
      var bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
      var plaintext = bytes.toString(CryptoJS.enc.Utf8);

      var markdown = window.markdownit();
      var content = markdown.render(plaintext);

      contentDiv.html(content);
    }

    hljs.initHighlighting();
  }
});
