$(document).on('turbolinks:load', function() {
  var createForm = $('#new_paste');

  $('[name=generate-passphrase]').click(function() {
    var passphrase = Crypto.generatePassphrase();

    $('[name=passphrase]').val(passphrase);
  });


  $('[name=content]').prop('disabled', false);
  $('[name=passphrase]').prop('disabled', false);
  $('[type=submit]', createForm).prop('disabled', false).text('Create');

  createForm.on('submit', function(e) {
    // Don't send local data to server
    $('[name=content]').prop('disabled', true);
    $('[name=passphrase]').prop('disabled', true);

    var passphrase = $('[name=passphrase]').val();

    if (passphrase.length > 0) {
      $('[type=submit]', createForm).
        prop('disabled', true).
        text('Encrypting ...');
    }

    // Derivating a key from the passphrase will block the UI thread,
    // and we need to refresh the UI before that.
    // So we need to remove `remote: true` in `from_tag` and handle
    // the remote call here.
    setTimeout(function() {
      $.rails.handleRemote(createForm);
    }, 0);

    e.preventDefault();
  });

  createForm.on('ajax:before', function() {
    var content = $('[name=content]').val();
    var passphrase = $('[name=passphrase]').val();


    if (passphrase.length > 0) {
      // NOTE: The key derivation function will block the UI thread
      var encryptedContent = Crypto.encrypt(content, passphrase);

      $('[name="paste[content]"]').val(encryptedContent);
      $('[name="paste[encrypted]"]').val(true);
    } else {
      $('[name="paste[content]"]').val(content);
      $('[name="paste[encrypted]"]').val(false);
    }
    $('[type=submit]', createForm).text('Sending ...');
  });

  var decryptContent = function(passphrase) {
    var contentDiv = $('.content');

    if (contentDiv.length) {
      if (contentDiv.hasClass('encrypted')) {
        var encryptedContent = contentDiv.text().trim();

        if (passphrase.length > 0) {
          var content;

          try {
            content = Crypto.decrypt(encryptedContent, passphrase);
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
      $('[name=passphrase]').addClass('form-control-danger');
      $('.form-group').addClass('has-danger');
      $('.form-control-feedback').html(msg);
      $('.form-control-feedback').show();
    }
  };

  var decryptForm = $('#decrypt_paste');
  
  var decryptContentInit = function(passphrase) {
    if (passphrase.length > 0) {
      $('[name=passphrase]', decryptForm).prop('disabled', true);
      $('[type=submit]',     decryptForm).prop('disabled', true).
        text('Decrypting ...');
    }

    setTimeout(function() {
      decryptContent(passphrase);

      $('[name=passphrase]', decryptForm).prop('disabled', false);
      $('[type=submit]',     decryptForm).prop('disabled', false).
        text('Decrypt');
    }, 0);

  };

  var passphrase = window.location.hash.slice(1);
  
  $('[name=passphrase]').val(passphrase);
  decryptContentInit(passphrase);

  decryptForm.submit(function(e) {
    e.preventDefault();

    var passphrase = $('[name=passphrase]').val();

    window.location.hash = passphrase;
    decryptContentInit(passphrase);
  });
});
