$(document).on('turbolinks:load', function() {
  $('[name=generate-passphrase]').click(function() {
    var passphrase = SecretBox.generatePassphrase();

    $('[name=passphrase]').val(passphrase);
  });

  $('#new_paste').submit(function() {
    var content = $('[name=content]').val();
    var passphrase = $('[name=passphrase]').val();

    if (passphrase.length > 0) {
      var encryptedContent = SecretBox.encrypt(content, passphrase);

      $('[name="paste[content]"]').val(encryptedContent);
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
        var encryptedContent = contentDiv.text().trim();

        if (passphrase.length > 0) {
          var content;

          try {
            content = SecretBox.decrypt(encryptedContent, passphrase);
          } catch(e) {
            return decryptContentError(passphrase, 'Invalid passphrase');
          }

          var markdown = window.markdownit();
          var html = markdown.render(content);

          contentDiv.html(html);
          contentDiv.removeClass('encrypted');
          $('.alert-encrypted').remove();
        } else {
          return decryptContentError(passphrase);
        }
      }

      hljs.initHighlighting.called = false;
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
