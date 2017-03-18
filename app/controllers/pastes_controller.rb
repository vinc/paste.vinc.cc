class PastesController < ApplicationController
  before_action :set_paste, only: [:show]

  def index
    @pastes = Paste.not.expired.desc(:created_at).limit(10)
  end

  def show
  end

  def new
    @paste = Paste.new
  end

  def create
    @pastes = Paste.where(ip_address: request.remote_ip)

    (0..3).each do |i|
      if @pastes.gt(created_at: (10 ** i).seconds.ago).count > i
        return head(:too_many_requests)
      end
    end

    @paste = @pastes.new(paste_params)

    respond_to do |format|
      if @paste.save
        format.html { redirect_to @paste, notice: 'Paste was successfully created.' }
        format.json { render :show, status: :created, location: @paste }
        format.js   { }
      else
        format.html { render :new }
        format.json { render json: @paste.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_paste
      @paste = Paste.not.expired.find_by(token: params[:token])
    end

    def paste_params
      expired_at_param = params.require(:paste).fetch(:expired_at, 'hour')
      params.require(:paste).permit(:content, :encrypted, :expired_at).
        merge(:expired_at => 1.send(expired_at_param.to_sym).from_now)
    end
end
