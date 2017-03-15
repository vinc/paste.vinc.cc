class PastesController < ApplicationController
  before_action :set_paste, only: [:show]

  def index
    @pastes = Paste.all
  end

  def show
  end

  def new
    @paste = Paste.new
  end

  def create
    @paste = Paste.new(paste_params)

    respond_to do |format|
      if @paste.save
        format.html { redirect_to @paste, notice: 'Paste was successfully created.' }
        format.json { render :show, status: :created, location: @paste }
      else
        format.html { render :new }
        format.json { render json: @paste.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_paste
      @paste = Paste.find_by(token: params[:token])
    end

    def paste_params
      params.require(:paste).permit(:content, :encrypted)
    end
end
