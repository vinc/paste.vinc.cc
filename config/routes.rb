Rails.application.routes.draw do
  resources :documents, param: :token, path: 'p', only: %i(index show new create)

  root 'documents#new'
end
