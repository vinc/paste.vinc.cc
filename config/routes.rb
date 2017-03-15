Rails.application.routes.draw do
  resources :pastes, param: :token, path: 'p', only: %i(index show new create)

  root 'pastes#new'
end
