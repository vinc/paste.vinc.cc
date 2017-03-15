json.extract! document, :token, :content, :encrypted, :created_at, :updated_at, :expired_at
json.url document_url(document, format: :json)
