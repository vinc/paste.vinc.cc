$(document).on('turbolinks:load', function() {
  $('[name=generate-passphrase]').click(function() {
    var passphrase = CryptoJS.lib.WordArray.random(32).toString();

    $('[name=passphrase]').val(passphrase);
  });

  $('#new_paste').submit(function() {
    var content = $('[name=content]').val();
    var passphrase = $('[name=passphrase]').val();

    if (passphrase.length > 0) {
      var plaintext = 'content:' + content;
      var ciphertext = CryptoJS.AES.encrypt(plaintext, passphrase).toString();

      $('[name="paste[content]"]').val(ciphertext);
      $('[name="paste[encrypted]"]').val(true);
    } else {
      $('[name="paste[content]"]').val(content);
      $('[name="paste[encrypted]"]').val(false);
    }

    // Don't send local data to server
    $('[name=content]').prop('disabled', true);
    $('[name=passphrase]').prop('disabled', true);
  });

  var decryptContent = function(passphrase) {
    var contentDiv = $('.content');

    if (contentDiv.length) {
      if (contentDiv.hasClass('encrypted')) {
        var ciphertext = contentDiv.text().trim();

        if (passphrase.length > 0) {
          var bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);

          var plaintext;
          try {
            plaintext = bytes.toString(CryptoJS.enc.Utf8);
          } catch(e) {
            return decryptContentError(passphrase, 'Invalid passphrase');
          }
          var start = 'content:';
          if (!plaintext.startsWith(start)) {
            return decryptContentError(passphrase, 'Invalid passphrase');
          }
          var content = plaintext.slice(start.length);
          console.log(plaintext);

          var markdown = window.markdownit();
          var html = markdown.render(content);

          contentDiv.html(html);
          contentDiv.removeClass('encrypted');
          $('.alert-encrypted').remove();
        } else {
          return decryptContentError(passphrase);
        }
      }

      hljs.initHighlighting();
    }
  };

  var decryptContentError = function(passphrase, msg) {
    if (msg) {
      $('[name=passphrase]').val(passphrase);
      $('[name=passphrase]').addClass('form-control-danger');
      $('.form-group').addClass('has-danger');
      $('.form-control-feedback').html(msg);
      $('.form-control-feedback').show();
    }
    $('.alert-encrypted').show();
  };

  var passphrase = window.location.hash.slice(1);
  decryptContent(passphrase);

  $('#decrypt_paste').submit(function(e) {
    var passphrase = $('[name=passphrase]').val();

    e.preventDefault();
    window.location.hash = passphrase;
    decryptContent(passphrase);
  });

});
