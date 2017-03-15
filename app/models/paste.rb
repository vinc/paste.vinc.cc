class Paste
  include Mongoid::Document
  include Mongoid::Timestamps
  include Tokenizable

  field :token,      type: String
  field :content,    type: String
  field :ip_address, type: String
  field :expired_at, type: Time,             default: 1.hour.from_now
  field :encrypted,  type: Mongoid::Boolean, default: false

  def self.expired
    self.lt(expired_at: Time.zone.now)
  end
end
